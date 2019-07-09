#!/bin/sh
npx qx serve --machine-readable --target=source --listen-port=8089 &
pid=$!
while ! nc -z localhost 8089; do sleep 1; done
node source-output/resource/qxl/testtapper/run.js http://localhost:8089/testtapper/
if [ $? = 5 ]; then
    echo GOOD. Expected 5 tests to fail.
    kill $pid
    exit 0
else
    echo BAD. Expected 5 tests to fail.    
    kill $pid
    exit 1
fi
