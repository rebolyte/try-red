#!/usr/local/bin/rebol -cs 

REBOL [] 

print "Content-type: text/plain^/"

qs: make object! decode-cgi system/options/cgi/query-string
script-id: qs/s

script-file: to file! rejoin ["./shares/" script-id ".red"]
print read script-file
