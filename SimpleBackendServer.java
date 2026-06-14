import com.sun.net.httpserver.*;
import java.io.*;
import java.net.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.sql.*;
import java.util.*;

public class SimpleBackendServer {

    public static void main(String[] args) throws Exception {
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        server.createContext("/user", new UserHandler());
        server.createContext("/resetPassword", new ResetPasswordHandler());
        server.createContext("/uploadSong", new UploadSongHandler());
        server.createContext("/playlist", new PlaylistHandler());
        server.createContext("/playlistSong", new PlaylistSongHandler());
        server.createContext("/like", new LikeHandler());
        server.createContext("/recent", new RecentHandler());
        server.createContext("/downloadSong", new DownloadHandler());
        server.createContext("/songs", new SongsHandler());
        server.createContext("/songFile", new SongFileHandler());
        server.createContext("/deleteSong", new DeleteSongHandler());
        server.createContext("/deleteArtist", new DeleteArtistHandler());
        server.setExecutor(null);
        System.out.println("TuneWave backend running at http://localhost:8080");
        server.start();
    }

    static abstract class BaseHandler implements HttpHandler {
        protected void setCors(HttpExchange exchange) {
            exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
            exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");
        }

        protected boolean handleOptions(HttpExchange exchange) throws IOException {
            setCors(exchange);
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(200, -1);
                return true;
            }
            return false;
        }

        protected Map<String, String> readForm(HttpExchange exchange) throws IOException {
            InputStream input = exchange.getRequestBody();
            String body = new String(input.readAllBytes(), StandardCharsets.UTF_8);
            Map<String, String> form = new HashMap<>();
            if (body.isEmpty()) return form;
            String[] pairs = body.split("&");
            for (String pair : pairs) {
                String[] parts = pair.split("=", 2);
                String key = URLDecoder.decode(parts[0], StandardCharsets.UTF_8);
                String value = parts.length > 1 ? URLDecoder.decode(parts[1], StandardCharsets.UTF_8) : "";
                form.put(key, value);
            }
            return form;
        }

        protected Map<String, String> readQuery(HttpExchange exchange) {
            Map<String, String> query = new HashMap<>();
            String raw = exchange.getRequestURI().getRawQuery();
            if (raw == null || raw.isEmpty()) return query;
            String[] pairs = raw.split("&");
            for (String pair : pairs) {
                String[] parts = pair.split("=", 2);
                String key = URLDecoder.decode(parts[0], StandardCharsets.UTF_8);
                String value = parts.length > 1 ? URLDecoder.decode(parts[1], StandardCharsets.UTF_8) : "";
                query.put(key, value);
            }
            return query;
        }

        protected void send(HttpExchange exchange, String text) throws IOException {
            setCors(exchange);
            byte[] data = text.getBytes(StandardCharsets.UTF_8);
            exchange.sendResponseHeaders(200, data.length);
            try (OutputStream out = exchange.getResponseBody()) {
                out.write(data);
            }
        }

        protected void sendJson(HttpExchange exchange, String json) throws IOException {
            setCors(exchange);
            exchange.getResponseHeaders().set("Content-Type", "application/json; charset=utf-8");
            byte[] data = json.getBytes(StandardCharsets.UTF_8);
            exchange.sendResponseHeaders(200, data.length);
            try (OutputStream out = exchange.getResponseBody()) {
                out.write(data);
            }
        }

        protected int toInt(String value, int defaultValue) {
            try {
                return Integer.parseInt(value);
            } catch (Exception e) {
                return defaultValue;
            }
        }

        protected int resolveValidUserId(Connection con, int requestedUserId) throws SQLException {
            if (requestedUserId > 0) {
                try (PreparedStatement checkUser = con.prepareStatement("SELECT id FROM users WHERE id=?")) {
                    checkUser.setInt(1, requestedUserId);
                    try (ResultSet rs = checkUser.executeQuery()) {
                        if (rs.next()) return rs.getInt("id");
                    }
                }
            }

            try (PreparedStatement fallbackUser = con.prepareStatement("SELECT id FROM users ORDER BY id ASC LIMIT 1");
                 ResultSet rs = fallbackUser.executeQuery()) {
                if (rs.next()) return rs.getInt("id");
            }

            return 0;
        }

        protected String json(String value) {
            if (value == null) return "";
            return value.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "\\r");
        }

        protected String toDuration(Path filePath) {
            if (filePath == null || !Files.exists(filePath)) return "0:00";
            try {
                long bytes = Files.size(filePath);
                long seconds = Math.max(1, bytes / 16000);
                long minutes = seconds / 60;
                return minutes + ":" + String.format("%02d", seconds % 60);
            } catch (Exception e) {
                return "0:00";
            }
        }

        protected Path resolveFilePath(String rawPath) {
            if (rawPath == null || rawPath.isBlank() || rawPath.startsWith("data:")) return null;
            Path direct = Paths.get(rawPath);
            if (Files.exists(direct)) return direct;
            Path projectRelative = Paths.get("..", rawPath);
            if (Files.exists(projectRelative)) return projectRelative.normalize();
            return null;
        }

        protected String saveDataUrlAsset(String dataUrl, String folderName, String fallbackName, String fallbackExtension) throws IOException {
            if (dataUrl == null || !dataUrl.startsWith("data:")) return dataUrl;
            int commaIndex = dataUrl.indexOf(',');
            if (commaIndex <= 5) return dataUrl;
            String header = dataUrl.substring(5, commaIndex);
            String payload = dataUrl.substring(commaIndex + 1).trim().replace(" ", "+");
            String mimeType = header.split(";", 2)[0];
            boolean isBase64 = header.contains(";base64");
            byte[] bytes = isBase64 ? Base64.getDecoder().decode(payload) : URLDecoder.decode(payload, StandardCharsets.UTF_8).getBytes(StandardCharsets.UTF_8);
            Path directory = Paths.get("media", folderName);
            Files.createDirectories(directory);
            String extension = extensionFromMimeType(mimeType, fallbackExtension);
            String safeName = slugify(fallbackName);
            String fileName = safeName + "-" + System.currentTimeMillis() + extension;
            Path target = directory.resolve(fileName).normalize();
            Files.write(target, bytes);
            return target.toString();
        }

        protected String slugify(String value) {
            return value == null ? "upload" : value.trim().replaceAll("[^A-Za-z0-9]+", "-").replaceAll("^-+|-+$", "");
        }

        protected String extensionFromMimeType(String mimeType, String fallback) {
            if (mimeType == null) return fallback;
            switch (mimeType.toLowerCase()) {
                case "audio/mpeg": case "audio/mp3": return ".mp3";
                case "audio/wav": return ".wav";
                case "image/jpeg": return ".jpg";
                case "image/png": return ".png";
                default: return fallback;
            }
        }

        protected String coverClassForId(int id) {
            String[] coverClasses = {"artwork-a", "artwork-b", "artwork-c", "artwork-d", "artwork-e", "artwork-f"};
            int safeIndex = Math.floorMod(Math.max(id - 1, 0), coverClasses.length);
            return coverClasses[safeIndex];
        }

        protected List<String> splitArtistNames(String rawArtist) {
            List<String> names = new ArrayList<>();
            if (rawArtist == null) return names;
            for (String part : rawArtist.split(",")) {
                String trimmed = part.trim();
                if (!trimmed.isEmpty() && !names.contains(trimmed)) {
                    names.add(trimmed);
                }
            }
            return names;
        }

        protected boolean artistMatches(String storedArtist, String targetArtist) {
            String target = targetArtist == null ? "" : targetArtist.trim().toLowerCase();
            if (target.isEmpty()) return false;
            for (String name : splitArtistNames(storedArtist)) {
                if (name.trim().toLowerCase().equals(target)) return true;
            }
            return false;
        }

        protected boolean hasColumn(Connection con, String tableName, String columnName) {
            try (ResultSet columns = con.getMetaData().getColumns(null, null, tableName, columnName)) {
                return columns.next();
            } catch (SQLException error) {
                return false;
            }
        }
    }

    static class UserHandler extends BaseHandler {
        public void handle(HttpExchange exchange) throws IOException {
            if (handleOptions(exchange)) return;
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                send(exchange, "Use POST");
                return;
            }
            Map<String, String> form = readForm(exchange);
            String action = form.get("action");
            try (Connection con = DBConnection.getConnection()) {
                if ("signup".equals(action)) {
                    String email = form.get("email");
                    PreparedStatement check = con.prepareStatement("SELECT id FROM users WHERE email=?");
                    check.setString(1, email);
                    if (check.executeQuery().next()) {
                        send(exchange, "Error: email already exists");
                        return;
                    }
                    PreparedStatement ps = con.prepareStatement("INSERT INTO users(username, email, phone, password) VALUES(?, ?, ?, ?)", Statement.RETURN_GENERATED_KEYS);
                    ps.setString(1, form.get("username"));
                    ps.setString(2, email);
                    ps.setString(3, form.get("phone"));
                    ps.setString(4, form.get("password"));
                    ps.executeUpdate();
                    ResultSet keys = ps.getGeneratedKeys();
                    int userId = keys.next() ? keys.getInt(1) : 0;
                    send(exchange, "Signup successful|" + userId + "|" + form.get("username"));
                    return;
                }
                if ("login".equals(action)) {
                    PreparedStatement ps = con.prepareStatement("SELECT id, username FROM users WHERE email=? AND password=?");
                    ps.setString(1, form.get("email"));
                    ps.setString(2, form.get("password"));
                    ResultSet rs = ps.executeQuery();
                    if (rs.next()) {
                        send(exchange, "Login successful|" + rs.getInt("id") + "|" + rs.getString("username"));
                    } else {
                        send(exchange, "Invalid email or password");
                    }
                    return;
                }
                send(exchange, "Error: invalid action");
            } catch (Exception e) {
                send(exchange, "Error: " + e.getMessage());
            }
        }
    }

    static class ResetPasswordHandler extends BaseHandler {
        public void handle(HttpExchange exchange) throws IOException {
            if (handleOptions(exchange)) return;
            Map<String, String> form = readForm(exchange);
            try (Connection con = DBConnection.getConnection()) {
                PreparedStatement ps = con.prepareStatement("UPDATE users SET password=? WHERE username=? AND email=? AND phone=?");
                ps.setString(1, form.get("password"));
                String username = form.get("username") != null ? form.get("username") : form.get("name");
                ps.setString(2, username);
                ps.setString(3, form.get("email"));
                ps.setString(4, form.get("phone"));
                int rows = ps.executeUpdate();
                send(exchange, rows > 0 ? "Password updated" : "No match found");
            } catch (Exception e) {
                send(exchange, "Error: " + e.getMessage());
            }
        }
    }

    static class UploadSongHandler extends BaseHandler {
        public void handle(HttpExchange exchange) throws IOException {
            if (handleOptions(exchange)) return;
            Map<String, String> form = readForm(exchange);
            int requestedUserId = toInt(form.get("uploaded_by"), 0);
            try (Connection con = DBConnection.getConnection()) {
                int userId = resolveValidUserId(con, requestedUserId);
                if (userId <= 0) {
                    send(exchange, "Error: create or log in to a user account before uploading songs");
                    return;
                }
                String filePath = saveDataUrlAsset(form.get("file_path"), "songs", form.get("title"), ".mp3");
                String coverPath = saveDataUrlAsset(form.get("cover_path"), "covers", form.get("title"), ".png");
                String movieCoverPath = saveDataUrlAsset(form.get("movie_cover_path"), "movie-covers", form.get("genre"), ".png");
                String artistImg = saveDataUrlAsset(form.get("artist_image_path"), "artists", form.get("artist"), ".png");
                if (artistImg == null) artistImg = "";

                List<String> artistNames = splitArtistNames(form.get("artist"));
                if (artistNames.isEmpty() && form.get("artist") != null && !form.get("artist").trim().isEmpty()) {
                    artistNames = Collections.singletonList(form.get("artist").trim());
                }
                if (!artistNames.contains(form.get("artist"))) {
                    artistNames = new ArrayList<>(artistNames);
                    artistNames.add(0, form.get("artist"));
                }

                for (String artistName : artistNames) {
                    PreparedStatement checkArtist = con.prepareStatement("SELECT id FROM artists WHERE name=?");
                    checkArtist.setString(1, artistName);
                    ResultSet rs = checkArtist.executeQuery();
                    if (rs.next()) {
                        if (!artistImg.isEmpty()) {
                            PreparedStatement update = con.prepareStatement("UPDATE artists SET image_path=?, genre=? WHERE name=?");
                            update.setString(1, artistImg);
                            update.setString(2, form.get("genre"));
                            update.setString(3, artistName);
                            update.executeUpdate();
                        }
                    } else {
                        PreparedStatement insert = con.prepareStatement("INSERT INTO artists(name, genre, image_path) VALUES(?, ?, ?)");
                        insert.setString(1, artistName);
                        insert.setString(2, form.get("genre"));
                        insert.setString(3, artistImg);
                        insert.executeUpdate();
                    }
                }

                // Insert song
                boolean hasMovieCoverColumn = hasColumn(con, "songs", "movie_cover_path");
                String insertSql = hasMovieCoverColumn
                    ? "INSERT INTO songs(title, artist, lyricist, music_by, file_path, cover_path, movie_cover_path, uploaded_by, movie) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)"
                    : "INSERT INTO songs(title, artist, lyricist, music_by, file_path, cover_path, uploaded_by, movie) VALUES(?, ?, ?, ?, ?, ?, ?, ?)";
                PreparedStatement songPs = con.prepareStatement(insertSql, Statement.RETURN_GENERATED_KEYS);
                songPs.setString(1, form.get("title"));
                songPs.setString(2, form.get("artist"));
                songPs.setString(3, form.get("lyricist"));
                songPs.setString(4, form.get("music_by"));
                songPs.setString(5, filePath);
                songPs.setString(6, coverPath);
                if (hasMovieCoverColumn) {
                    songPs.setString(7, movieCoverPath);
                    songPs.setInt(8, userId);
                    songPs.setString(9, form.get("genre"));
                } else {
                    songPs.setInt(7, userId);
                    songPs.setString(8, form.get("genre"));
                }
                songPs.executeUpdate();
                ResultSet keys = songPs.getGeneratedKeys();
                int songId = keys.next() ? keys.getInt(1) : 0;
                send(exchange, "Song uploaded successfully|" + songId + "|" + form.get("title"));
            } catch (Exception e) {
                send(exchange, "Error: " + e.getMessage());
            }
        }
    }

    static class PlaylistHandler extends BaseHandler {
        public void handle(HttpExchange exchange) throws IOException {
            if (handleOptions(exchange)) return;
            Map<String, String> form = readForm(exchange);
            try (Connection con = DBConnection.getConnection()) {
                PreparedStatement ps = con.prepareStatement("INSERT INTO playlists(name, user_id) VALUES(?, ?)");
                ps.setString(1, form.get("name"));
                ps.setInt(2, toInt(form.get("user_id"), 1));
                ps.executeUpdate();
                send(exchange, "Playlist created");
            } catch (Exception e) {
                send(exchange, "Error: " + e.getMessage());
            }
        }
    }

    static class PlaylistSongHandler extends BaseHandler {
        public void handle(HttpExchange exchange) throws IOException {
            if (handleOptions(exchange)) return;
            Map<String, String> form = readForm(exchange);
            try (Connection con = DBConnection.getConnection()) {
                PreparedStatement ps = con.prepareStatement("INSERT INTO playlist_songs(playlist_id, song_id) VALUES(?, ?)");
                ps.setInt(1, toInt(form.get("playlist_id"), 0));
                ps.setInt(2, toInt(form.get("song_id"), 0));
                ps.executeUpdate();
                send(exchange, "Song added to playlist");
            } catch (Exception e) {
                send(exchange, "Error: " + e.getMessage());
            }
        }
    }

    static class LikeHandler extends BaseHandler {
        public void handle(HttpExchange exchange) throws IOException {
            if (handleOptions(exchange)) return;
            Map<String, String> form = readForm(exchange);
            try (Connection con = DBConnection.getConnection()) {
                PreparedStatement ps = con.prepareStatement("INSERT INTO likes(user_id, song_id) VALUES(?, ?)");
                ps.setInt(1, toInt(form.get("user_id"), 1));
                ps.setInt(2, toInt(form.get("song_id"), 0));
                ps.executeUpdate();
                send(exchange, "Song liked");
            } catch (Exception e) {
                send(exchange, "Error: " + e.getMessage());
            }
        }
    }

    static class RecentHandler extends BaseHandler {
        public void handle(HttpExchange exchange) throws IOException {
            if (handleOptions(exchange)) return;
            Map<String, String> form = readForm(exchange);
            try (Connection con = DBConnection.getConnection()) {
                PreparedStatement ps = con.prepareStatement("INSERT INTO recent(user_id, song_id) VALUES(?, ?)");
                ps.setInt(1, toInt(form.get("user_id"), 1));
                ps.setInt(2, toInt(form.get("song_id"), 0));
                ps.executeUpdate();
                send(exchange, "Recent saved");
            } catch (Exception e) {
                send(exchange, "Error: " + e.getMessage());
            }
        }
    }

    static class DownloadHandler extends BaseHandler {
        public void handle(HttpExchange exchange) throws IOException {
            if (handleOptions(exchange)) return;
            Map<String, String> form = readForm(exchange);
            try (Connection con = DBConnection.getConnection()) {
                PreparedStatement ps = con.prepareStatement("INSERT INTO downloads(user_id, song_id) VALUES(?, ?)");
                ps.setInt(1, toInt(form.get("user_id"), 1));
                ps.setInt(2, toInt(form.get("song_id"), 0));
                ps.executeUpdate();
                send(exchange, "Download saved");
            } catch (Exception e) {
                send(exchange, "Error: " + e.getMessage());
            }
        }
    }

    static class SongsHandler extends BaseHandler {
        public void handle(HttpExchange exchange) throws IOException {
            if (handleOptions(exchange)) return;
            if (!"GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                send(exchange, "Use GET");
                return;
            }
            StringBuilder json = new StringBuilder("[");
            boolean first = true;
            try (Connection con = DBConnection.getConnection()) {
                boolean hasMovieCoverColumn = hasColumn(con, "songs", "movie_cover_path");
                String sql = hasMovieCoverColumn
                    ? "SELECT s.id, s.title, s.artist, s.lyricist, s.music_by, s.file_path, s.cover_path, COALESCE(s.movie_cover_path, '') as movie_cover_path, s.uploaded_by, COALESCE(s.movie, '') as movie, COALESCE(a.image_path, '') as artist_image_path FROM songs s LEFT JOIN artists a ON a.name = s.artist ORDER BY s.id DESC"
                    : "SELECT s.id, s.title, s.artist, s.lyricist, s.music_by, s.file_path, s.cover_path, s.uploaded_by, COALESCE(s.movie, '') as movie, COALESCE(a.image_path, '') as artist_image_path FROM songs s LEFT JOIN artists a ON a.name = s.artist ORDER BY s.id DESC";
                try (PreparedStatement ps = con.prepareStatement(sql); ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    if (!first) json.append(",");
                    first = false;
                    int id = rs.getInt("id");
                    String title = rs.getString("title");
                    String artist = rs.getString("artist");
                    String filePath = rs.getString("file_path");
                    String coverPath = rs.getString("cover_path");
                    String movieCoverPath = hasMovieCoverColumn ? rs.getString("movie_cover_path") : "";
                    String artistImagePath = rs.getString("artist_image_path");
                    Path audio = resolveFilePath(filePath);
                    String audioUrl = id > 0 ? "http://127.0.0.1:8080/songFile?id=" + id : "";
                    String coverUrl = resolveFilePath(coverPath) != null ? resolveFilePath(coverPath).toUri().toString() : "";
                    String movieCoverUrl = resolveFilePath(movieCoverPath) != null ? resolveFilePath(movieCoverPath).toUri().toString() : "";
                    String artistImageUrl = resolveFilePath(artistImagePath) != null ? resolveFilePath(artistImagePath).toUri().toString() : "";
                    String duration = audio != null ? toDuration(audio) : "0:12";
                    json.append("{\"id\":").append(id)
                        .append(",\"title\":\"").append(json(title)).append("\"")
                        .append(",\"artist\":\"").append(json(artist)).append("\"")
                        .append(",\"duration\":\"").append(json(duration)).append("\"")
                        .append(",\"mood\":\"").append(json(rs.getString("movie"))).append("\"")
                        .append(",\"movie\":\"").append(json(rs.getString("movie"))).append("\"")
                        .append(",\"audioUrl\":\"").append(json(audioUrl)).append("\"")
                        .append(",\"coverUrl\":\"").append(json(coverUrl)).append("\"")
                        .append(",\"movieCoverUrl\":\"").append(json(movieCoverUrl)).append("\"")
                        .append(",\"artistImageUrl\":\"").append(json(artistImageUrl)).append("\"")
                        .append(",\"coverClass\":\"").append(coverClassForId(id)).append("\"")
                        .append("}");
                }
                }
            } catch (Exception e) {
                send(exchange, "Error: " + e.getMessage());
                return;
            }
            json.append("]");
            sendJson(exchange, json.toString());
        }
    }

    static class DeleteSongHandler extends BaseHandler {
        public void handle(HttpExchange exchange) throws IOException {
            if (handleOptions(exchange)) return;
            Map<String, String> q = readQuery(exchange);
            int songId = toInt(q.get("id"), 0);
            int userId = toInt(q.get("user_id"), 0);
            if (songId <= 0) {
                send(exchange, "Error: invalid song ID");
                return;
            }
            try (Connection con = DBConnection.getConnection()) {
                PreparedStatement[] deletes = {
                    con.prepareStatement("DELETE FROM playlist_songs WHERE song_id=?"),
                    con.prepareStatement("DELETE FROM likes WHERE song_id=?"),
                    con.prepareStatement("DELETE FROM recent WHERE song_id=?"),
                    con.prepareStatement("DELETE FROM downloads WHERE song_id=?"),
                    con.prepareStatement("DELETE FROM newly_released_songs WHERE song_id=?"),
                    con.prepareStatement("DELETE FROM songs WHERE id=?")
                };
                deletes[0].setInt(1, songId); deletes[0].executeUpdate();
                deletes[1].setInt(1, songId); deletes[1].executeUpdate();
                deletes[2].setInt(1, songId); deletes[2].executeUpdate();
                deletes[3].setInt(1, songId); deletes[3].executeUpdate();
                deletes[4].setInt(1, songId); deletes[4].executeUpdate();
                deletes[5].setInt(1, songId);
                int result = deletes[5].executeUpdate();
                send(exchange, result > 0 ? "Song deleted" : "Not found/unauthorized");
            } catch (Exception e) {
                send(exchange, "Error: " + e.getMessage());
            }
        }
    }

    static class DeleteArtistHandler extends BaseHandler {
        public void handle(HttpExchange exchange) throws IOException {
            if (handleOptions(exchange)) return;
            Map<String, String> q = readQuery(exchange);
            String name = q.get("name");
            int userId = toInt(q.get("user_id"), 0);
            if (name == null || name.trim().isEmpty()) {
                send(exchange, "Error: artist name required");
                return;
            }
            try (Connection con = DBConnection.getConnection()) {
                List<Integer> matchingSongIds = new ArrayList<>();
                PreparedStatement findSongs = con.prepareStatement("SELECT id, artist FROM songs");
                ResultSet songResults = findSongs.executeQuery();
                while (songResults.next()) {
                    if (artistMatches(songResults.getString("artist"), name)) {
                        matchingSongIds.add(songResults.getInt("id"));
                    }
                }

                for (Integer songId : matchingSongIds) {
                    PreparedStatement delPlaylistSongs = con.prepareStatement("DELETE FROM playlist_songs WHERE song_id=?");
                    PreparedStatement delLikes = con.prepareStatement("DELETE FROM likes WHERE song_id=?");
                    PreparedStatement delRecent = con.prepareStatement("DELETE FROM recent WHERE song_id=?");
                    PreparedStatement delDownloads = con.prepareStatement("DELETE FROM downloads WHERE song_id=?");
                    PreparedStatement delNewReleases = con.prepareStatement("DELETE FROM newly_released_songs WHERE song_id=?");
                    PreparedStatement delSongs = con.prepareStatement("DELETE FROM songs WHERE id=?");
                    delPlaylistSongs.setInt(1, songId); delPlaylistSongs.executeUpdate();
                    delLikes.setInt(1, songId); delLikes.executeUpdate();
                    delRecent.setInt(1, songId); delRecent.executeUpdate();
                    delDownloads.setInt(1, songId); delDownloads.executeUpdate();
                    delNewReleases.setInt(1, songId); delNewReleases.executeUpdate();
                    delSongs.setInt(1, songId); delSongs.executeUpdate();
                }

                PreparedStatement delArtist = con.prepareStatement("DELETE FROM artists WHERE LOWER(name)=LOWER(?)");
                delArtist.setString(1, name.trim());
                int result = delArtist.executeUpdate();
                send(exchange, result > 0 || !matchingSongIds.isEmpty() ? "Artist deleted" : "Not found");
            } catch (Exception e) {
                send(exchange, "Error: " + e.getMessage());
            }
        }
    }

    static class SongFileHandler extends BaseHandler {
        public void handle(HttpExchange exchange) throws IOException {
            if (handleOptions(exchange)) return;
            if (!"GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                send(exchange, "Use GET");
                return;
            }
            Map<String, String> q = readQuery(exchange);
            int id = toInt(q.get("id"), 0);
            if (id <= 0) {
                send(exchange, "Error: invalid ID");
                return;
            }
            String sql = "SELECT file_path FROM songs WHERE id=?";
            try (Connection con = DBConnection.getConnection(); PreparedStatement ps = con.prepareStatement(sql)) {
                ps.setInt(1, id);
                ResultSet rs = ps.executeQuery();
                if (!rs.next()) {
                    exchange.sendResponseHeaders(404, -1);
                    return;
                }
                Path file = resolveFilePath(rs.getString("file_path"));
                if (file == null || !Files.exists(file)) {
                    byte[] wav = buildFallbackWav(id);
                    setCors(exchange);
                    exchange.getResponseHeaders().set("Content-Type", "audio/wav");
                    exchange.sendResponseHeaders(200, wav.length);
                    try (OutputStream out = exchange.getResponseBody()) { out.write(wav); }
                    return;
                }
                setCors(exchange);
                String mime = Files.probeContentType(file);
                exchange.getResponseHeaders().set("Content-Type", mime != null ? mime : "audio/mpeg");
                exchange.sendResponseHeaders(200, Files.size(file));
                try (OutputStream out = exchange.getResponseBody()) { Files.copy(file, out); }
            } catch (Exception e) {
                send(exchange, "Error: " + e.getMessage());
            }
        }
        
        private byte[] buildFallbackWav(int id) throws IOException {
            int sampleRate = 22050, channels = 1, bits = 16, seconds = 12;
            int samples = sampleRate * seconds;
            int dataSize = samples * channels * bits / 8;
            double freq = 220 + (Math.max(id, 1) % 12 * 25);
            ByteArrayOutputStream baos = new ByteArrayOutputStream(44 + dataSize);
            DataOutputStream dos = new DataOutputStream(baos);
            dos.write("RIFF".getBytes(StandardCharsets.US_ASCII));
            dos.writeInt(36 + dataSize);
            dos.write("WAVE".getBytes(StandardCharsets.US_ASCII));
            dos.write("fmt ".getBytes(StandardCharsets.US_ASCII));
            dos.writeInt(16); dos.writeShort((short)1); dos.writeShort((short)channels);
            dos.writeInt(sampleRate); dos.writeInt(sampleRate * channels * bits / 8);
            dos.writeShort((short)(channels * bits / 8)); dos.writeShort((short)bits);
            dos.write("data".getBytes(StandardCharsets.US_ASCII));
            dos.writeInt(dataSize);
            for (int i = 0; i < samples; i++) {
                double t = i / (double)sampleRate;
                double env = 0.35 * Math.sin(Math.PI * i / samples);
                double val = Math.sin(2 * Math.PI * freq * t) * 0.6 + Math.sin(2 * Math.PI * freq * 1.5 * t) * 0.25;
                short samp = (short)Math.max(Short.MIN_VALUE, Math.min(Short.MAX_VALUE, val * env * Short.MAX_VALUE));
                dos.writeShort(samp);
            }
            dos.flush();
            return baos.toByteArray();
        }
    }
}
