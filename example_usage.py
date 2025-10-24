from data_generator import AIDataGenerator, DataConfig

# Generate data for SQL
sql_config = DataConfig(
    db_type='sql',
    connection_string='ai_metrics.db',
    table_name='ai_performance',
    num_records=100
)

sql_generator = AIDataGenerator(sql_config)
sql_generator.generate_and_save()

# Generate data for MongoDB (uncomment when MongoDB is available)
# mongo_config = DataConfig(
#     db_type='mongo',
#     connection_string='mongodb://localhost:27017/ai_data',
#     table_name='ai_metrics',
#     num_records=100
# )
# 
# mongo_generator = AIDataGenerator(mongo_config)
# mongo_generator.generate_and_save()
