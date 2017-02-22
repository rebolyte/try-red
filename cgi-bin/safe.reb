rebol [
	author: "Gregg Irwin"
]

; In R2 for now, since %eval.cgi uses that. Could easily run a Red
; app to do it as well. It has new parse features that give you a
; lot more control when forcing rules to fail or doing logic checks.

bad-words: [do call read write]

bad-word=: [
	['do | 'call | 'read | 'write] (throw 'danger)
]

; Just looking for the plain words isn't enough, because all these
; funcs have refinements, and the combinations they could create is
; huge.
bad-path=: [
	set p path! (if find bad-words first p [throw 'danger])
]

main=: [
	some [into main= | bad-word= | bad-path= | skip]
]

is-safe?: func [code] [
	either 'danger = catch [parse code main=] [
		return false
	][
		return true
	]
]

;-------------------------------------------------------------------------------

; tests: [
; 	[a b c d e f] ; no danger
; 	[a b c do e f]
; 	[a b call d e f]
; 	[a b c d e [f g [read]]]
; 	[a b c d e [f g [write]]]
; 	[a read/binary/direct/with c]
; 	[a write/part/lines/custom c]
; 	[a b c d e [f g [h i]]] ; no danger
; ]

; foreach test tests [
; 	if 'danger = catch [parse test main=] [
; 		print ["DANGER!:" mold test]
; 	]
; ]

; halt
