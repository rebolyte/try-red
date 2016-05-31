REBOL []

generate-id: func [/length len /local out chars] [
	chars: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_"
	out: copy ""
	if none? len [ len: 8 ]
	loop len [
		random/seed form now/precise
		ind: random/secure length? chars
		append out pick chars ind
	]
	out
]

; loop 5 [ print generate-id ]
