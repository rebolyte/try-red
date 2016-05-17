
function ready(fn) {
	if (document.readyState !== 'loading'){
		fn();
	} else {
		document.addEventListener('DOMContentLoaded', fn);
	}
}

// This gives us simple dollar function and event binding
var $ = document.querySelector.bind(document);
var $$ = document.querySelectorAll.bind(document);
Node.prototype.on = Node.prototype.addEventListener;
// Usage:
// $('#element').on('touchstart', handleTouch, false);
// $$('.element')[0].on('touchstart', handleTouch, false);


function executeCode(code) {
	atomic.post('/cgi-bin/eval.cgi', code)
		.success(function (data, xhr) {
			$('#output').innerHTML = data;
		})
		.error(function (data, xhr) {
			$('#output').innerHTML = 'There was a problem evaluating your code.';
			console.error(data, xhr);
		})
		.always(function (data, xhr) {});
}

function showDialog(node) {
	node.style.display = 'block';
	$('#underlay').style.display = 'block';
}
function hideDialog(node) {
	node.style.display = 'none';
	$('#underlay').style.display = 'none';
}

function init() {
	var editor = ace.edit('editor');
	editor.setTheme('ace/theme/twilight');
	editor.session.setMode('ace/mode/plain_text');

	$('#runBtn').on('click', function (evt) {
		executeCode(editor.getValue());
	});
	document.documentElement.on('keydown', function(evt) {
		if (evt.ctrlKey && evt.which === 13) {
			executeCode(editor.getValue());
		}
	});

	$('#shareBtn').on('click', function (evt) {
		showDialog($('#shareDialog'));
	});

	$('#helpBtn').on('click', function (evt) {
		showDialog($('#helpDialog'));
	});

	$('#aboutBtn').on('click', function (evt) {
		showDialog($('#aboutDialog'));
	});

	Array.prototype.slice.call($$('.dialogCloseBtn'), 0).forEach(function (node) {
		node.on('click', function (evt) {
			hideDialog(node.parentNode);
		})
	});	
}


// http://stackoverflow.com/a/27047981/2486583
var d = document.documentElement.style
if (('flexWrap' in d) || ('WebkitFlexWrap' in d) || ('msFlexWrap' in d)){
	// alert('ok');
} else {
	alert("You don't appear to be using a browser that supports flexbox. Things may still function, but you will most likely see layout issues.");
}

var test = {
	addEventListener : !!window.addEventListener,
	querySelectorAll : !!document.querySelectorAll,
};
if (test.addEventListener && test.querySelectorAll) {
	ready(init);
} else {
	alert("You appear to be using a very old browser. To use this app, please upgrade to at least Internet Explorer 9 or a more modern browser.");
}
