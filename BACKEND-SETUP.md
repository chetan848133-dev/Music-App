# TuneWave Simple Backend Setup

## 1. Start MySQL on your Mac
Run:

```bash
/usr/local/mysql/support-files/mysql.server start
```

If it gives permission issues, start MySQL from System Settings or MySQL Workbench if installed.

## 2. Create database and tables
Run:

```bash
mysql -uroot -p
```

Enter password:

```text
Chetan@265653
```

Then run:

```sql
SOURCE /Users/nivathakur/Downloads/JAVA\ FINAL\ PROJECT/database.sql;
```

## 3. Start Java backend
Run:

```bash
cd "/Users/nivathakur/Downloads/JAVA FINAL PROJECT"
chmod +x start-backend.sh
./start-backend.sh
```

Optional: if your MySQL host/user/password are different, set these first:

```bash
export TUNEWAVE_DB_URL="jdbc:mysql://127.0.0.1:3306/tunewave"
export TUNEWAVE_DB_USER="root"
export TUNEWAVE_DB_PASSWORD="your-password"
```

Backend will run on:

```text
http://localhost:8080
```

## 4. Open frontend
Open your HTML pages normally. Login, signup, forgot password, upload song, and add artist now point to this backend.
