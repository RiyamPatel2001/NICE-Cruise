# db_workbench_check.py
import os
import django
from django.db import connection

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "myproject.settings")
django.setup()

def check_mysql_workbench_connection():
    print("🔍 MySQL Workbench Connection Check")
    
    try:
        # Test basic connection
        with connection.cursor() as cursor:
            # Get MySQL version
            cursor.execute("SELECT VERSION()")
            mysql_version = cursor.fetchone()[0]
            print(f"✅ MySQL Version: {mysql_version}")
            
            # Check database name
            cursor.execute("SELECT DATABASE()")
            current_db = cursor.fetchone()[0]
            print(f"📂 Current Database: {current_db}")
            
            # Check table origin
            print("\n🕵️ Table Origin Investigation:")
            cursor.execute("SHOW TABLE STATUS")
            tables = cursor.fetchall()
            
            workbench_indicators = []
            for table in tables:
                table_name, engine, version, row_format, table_rows, avg_row_length, data_length, max_data_length, index_length, data_free, auto_increment, create_time, update_time, check_time, table_collation, checksum, create_options, comment = table
                
                # Indicators of MySQL Workbench creation
                if comment and 'PRIMARY KEY OF THE' in comment:
                    workbench_indicators.append(table_name)
            
            if workbench_indicators:
                print("🏭 Tables likely created in MySQL Workbench:")
                for table in workbench_indicators:
                    print(f"   - {table}")
            else:
                print("❓ No clear indicators of MySQL Workbench origin found")
    
    except Exception as e:
        print(f"❌ Connection Error: {e}")

def detailed_workbench_check():
    with connection.cursor() as cursor:
        # Check for Workbench-specific comments
        cursor.execute("""
            SELECT TABLE_NAME, TABLE_COMMENT 
            FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_SCHEMA = DATABASE() 
            AND TABLE_COMMENT LIKE '%PRIMARY KEY%'
        """)
        tables_with_comments = cursor.fetchall()
        
        print("\n🔍 Workbench-Style Table Comments:")
        for table, comment in tables_with_comments:
            print(f"   - {table}: {comment}")

if __name__ == "__main__":
    check_mysql_workbench_connection()
    detailed_workbench_check()