#!/usr/local/bin/rebol -cs 

REBOL [] 

; http://www.rebol.com/docs/cgi2.html

print "Content-type: text/plain^/"
; print "working!"
; print system/options/cgi/request-method
; do read-cgi
write/binary %tmp.red rejoin ["Red [] " read-cgi]
out: copy ""
call/wait/output "redlang tmp.red" out

print out

delete %tmp.red
