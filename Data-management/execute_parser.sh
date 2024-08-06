#!/bin/bash

#List of directories
directories=(
    "/tmp/2024-1A"
    "/tmp/2024-2A"
    "/tmp/2024-3A"
    "/tmp/2024-4A"
    "/tmp/2024-5A"
    "/tmp/2024-5B"
    "/tmp/2024-6A"
)
# Number of times to execute the parser.py script
num_executions=${#directories[@]}

#Loop through the directories and execute parser.py
for (( i=0; i<$num_executions; i++ )); do
    echo "Executing Database.py with argument: ${directories[$i]}"
    python3 Database.py "${directories[$i]}"
    echo "Execution $((i+1)) completed."
    echo ""
done
