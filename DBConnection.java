import java.net.URL;
import java.net.URLClassLoader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.Driver;
import java.sql.DriverManager;
import java.sql.DriverPropertyInfo;
import java.sql.SQLException;
import java.sql.SQLFeatureNotSupportedException;
import java.util.Properties;
import java.util.logging.Logger;

public class DBConnection {
    private static final String DRIVER_CLASS = "com.mysql.cj.jdbc.Driver";
    private static final String DRIVER_JAR = "mysql-connector-j-8.3.0.jar";
    private static final String URL = System.getenv().getOrDefault(
        "TUNEWAVE_DB_URL",
        "jdbc:mysql://127.0.0.1:3306/tunewave"
    );
    private static final String USER = System.getenv().getOrDefault(
        "TUNEWAVE_DB_USER",
        "root"
    );
    private static final String PASSWORD = System.getenv().getOrDefault(
        "TUNEWAVE_DB_PASSWORD",
        "Chetan@265653"
    );
    private static volatile boolean driverLoaded = false;

    public static Connection getConnection() throws Exception {
        ensureDriverLoaded();
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }

    private static synchronized void ensureDriverLoaded() throws Exception {
        if (driverLoaded) return;

        try {
            Class.forName(DRIVER_CLASS);
            driverLoaded = true;
            return;
        } catch (ClassNotFoundException ignored) {
            // Fall back to loading the local connector jar for IDE/manual launches.
        }

        Path[] candidates = {
            Paths.get(DRIVER_JAR),
            Paths.get("..", DRIVER_JAR),
            Paths.get(System.getProperty("user.dir", "."), DRIVER_JAR),
            Paths.get(System.getProperty("user.dir", "."), "..", DRIVER_JAR)
        };

        for (Path candidate : candidates) {
            Path jarPath = candidate.toAbsolutePath().normalize();
            if (!Files.exists(jarPath)) continue;

            URL jarUrl = jarPath.toUri().toURL();
            URLClassLoader loader = new URLClassLoader(new URL[] { jarUrl }, DBConnection.class.getClassLoader());
            Driver driver = (Driver) Class.forName(DRIVER_CLASS, true, loader).getDeclaredConstructor().newInstance();
            DriverManager.registerDriver(new DriverShim(driver));
            driverLoaded = true;
            return;
        }

        throw new ClassNotFoundException(
            DRIVER_CLASS + " not found. Start the backend with " + DRIVER_JAR
            + " on the classpath or keep " + DRIVER_JAR + " in the project root."
        );
    }

    private static final class DriverShim implements Driver {
        private final Driver driver;

        private DriverShim(Driver driver) {
            this.driver = driver;
        }

        @Override
        public Connection connect(String url, Properties info) throws SQLException {
            return driver.connect(url, info);
        }

        @Override
        public boolean acceptsURL(String url) throws SQLException {
            return driver.acceptsURL(url);
        }

        @Override
        public DriverPropertyInfo[] getPropertyInfo(String url, Properties info) throws SQLException {
            return driver.getPropertyInfo(url, info);
        }

        @Override
        public int getMajorVersion() {
            return driver.getMajorVersion();
        }

        @Override
        public int getMinorVersion() {
            return driver.getMinorVersion();
        }

        @Override
        public boolean jdbcCompliant() {
            return driver.jdbcCompliant();
        }

        @Override
        public Logger getParentLogger() throws SQLFeatureNotSupportedException {
            return driver.getParentLogger();
        }
    }
}
