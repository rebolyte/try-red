#!/usr/local/bin/rebol -cs 

REBOL [] 

; http://www.rebol.com/docs/cgi2.html

do %gen-id.reb

print "Content-type: text/plain^/"
; print "working!"
; print system/options/cgi/request-method
; do read-cgi
tmp-file: to file! rejoin [generate-id ".red"]
write/binary tmp-file read-cgi
out: copy ""
call/wait/output rejoin ["redlang " tmp-file] out

print out

delete tmp-file