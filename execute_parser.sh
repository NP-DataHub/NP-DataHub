#!/bin/bash

# List of directories (example)
directories=(
    "/tmp/2020-1A"
    "/tmp/2020-1B"
    "/tmp/2020-2"
    "/tmp/2020-3"
    "/tmp/2020-4"
)

# Number of times to execute the parser.py script
num_executions=${#directories[@]}

# Loop through the directories and execute parser.py
for (( i=0; i<$num_executions; i++ )); do
    echo "Executing parser.py with argument: ${directories[$i]}"
    python3 parser.py "${directories[$i]}"
    echo "Execution $((i+1)) completed."
    echo ""
done
