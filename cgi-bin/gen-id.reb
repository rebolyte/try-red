REBOL []

; Bugged. Doesn't work reliably.
; generate-id: func [/length len /local out chars] [
; 	chars: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_"
; 	out: copy ""
; 	if none? len [ len: 8 ]
; 	loop len [
; 		random/seed form now/precise
; 		ind: random/secure length? chars
; 		append out pick chars ind
; 	]
; 	out
; ]

generate-id: func [
	/length len [integer!]
	/local bytes rand alphanum key
][
	if (fourth system/version) = 3 [
		make error! "this function uses /dev/urandom, which is not available on windows."
	]
	if none? len [ len: 8 ]
	bytes: len * 10
	rand: copy ""
	alphanum: charset [#"0" - #"9" #"A" - #"Z" #"a" - #"z" #"-" #"_"]
	key: copy ""

	call/wait/output rejoin ["head -c " bytes " /dev/urandom"] rand

	parse/all rand [
		some [
			copy char some alphanum (append key char) |
			skip
		]
	]
	clear skip key len
	either (length? key) >= len [
		return key
	][
		; retry
		generate-id len
	]
]

; loop 10 [print generate-id/length 10]


; Dad's versions
; randomize: func [
; 	"Reseed the random number generator."
; 	/with seed "date, time, and integer values are used directly; others are converted"
; ][
; 	random/seed either find [date! time! integer!] type?/word seed [seed] [
; 		form any [seed now/precise]
; 	]
; ]

; generate-id: does [
; 	chars: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_"
; 	randomize
; 	rejoin collect [
; 		repeat i 5 [keep random/only chars]
; 	]
; ]

; head collect/into [
; 	loop 5 [keep random/only chars]
; ] copy ""
