#!/bin/bash

#List of directories (example)
echo "Executing DatabaseStarter.py"
time python3 DatabaseStarter.py
echo ""

directories=(
    "/tmp/2023-1A"
    "/tmp/2023-2A"
    "/tmp/2023-3A"
    "/tmp/2023-4A"
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
