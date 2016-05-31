#!/usr/local/bin/rebol -cs 

REBOL [] 

do %gen-id.reb

print "Content-type: text/plain^/"

id: generate-id
out-file: to file! rejoin ["./shares/" id ".red"]
either not exists? out-file [
	write/binary out-file read-cgi
	print id
][
	print "PROBLEM"
]

