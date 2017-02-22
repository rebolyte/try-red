#!/usr/local/bin/rebol -cs

REBOL []

; http://www.rebol.com/docs/cgi2.html

do %gen-id.reb
do %safe.reb

print "Content-type: text/plain^/"
; print system/options/cgi/request-method
; do read-cgi

code: read-cgi
either is-safe? load code [
	tmp-file: to file! rejoin [generate-id ".red"]
	write/binary tmp-file code
	out: copy ""
	call/wait/output rejoin ["redlang " tmp-file] out
	print out
	delete tmp-file
][
	print "Oops, you tried to use a command not allowed in this sandbox: ['do | 'call | 'read | 'write]"
]


; $ ps -aux =
; USER      PID   %CPU %MEM VSZ   RSS   TTY      STAT START   TIME COMMAND
; james     6236  0.8  0.1  16756 15276 pts/1    S+   16:37   0:00 redlang test.red
; RSS = resident set size, the non-swapped physical memory that a task has used (in KiB)


; parsed: parse output none

; print mold parsed
; print ["PID:" parsed/2]
; print ["CPU:" parsed/3]
; print ["Memory:" parsed/6]

; get-stats: func [filename [string!]] [
; 	; output: "james     6236  0.8  0.1  16756 15276 pts/1    S+   16:37   0:00 redlang test.red"
; 	output: copy ""
; 	call/wait/output "ps -aux" output
; 	lines: parse/all output "^/"
; 	foreach line lines [
; 		parsed: parse line none
; 		cmd: skip parsed 10
; 		; print mold cmd
; 		if ((first cmd) = "redlang") [
; 			; nest this since some processes don't have a filename
; 			if ((second cmd) = filename) [
; 				; print "That's it!"
; 				print mold parsed
; 				return reduce [
; 					'pid to integer! parsed/2
; 					'cpu to decimal! parsed/3
; 					'mem to integer! parsed/6
; 				]
; 			]
; 		]
; 	]

; ]

; stats: get-stats "test.red"
; print mold stats

; while [not empty? output] [
; 	stats: get-stats
; 	if (stats/cpu > 50) or (stats/mem > 25) [
; 		print "kill"
; 	]
; ]
