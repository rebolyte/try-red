/* global Promise, Clipboard */

(function () {
	'use strict';

	function ready(fn) {
		if (document.readyState !== 'loading'){
			fn();
		} else {
			document.addEventListener('DOMContentLoaded', fn);
		}
	}

	function request(type, url, data) {
		return new Promise(function (resolve, reject) {
			var xhr = new XMLHttpRequest();

			// true = async
			xhr.open(type, url, true);

			xhr.onreadystatechange = function () {
				var req;
				if (xhr.readyState === 4) {
					req = xhr.responseText;
					if (xhr.status >= 200 && xhr.status < 300) {
						resolve(req);
					} else {
						reject(req);
					}
				}
			};

			xhr.send(data);
		});
	}

	var get = request.bind(this, 'GET');
	var post = request.bind(this, 'POST');

	var $ = document.querySelector.bind(document);
	var $$ = document.querySelectorAll.bind(document);
	Node.prototype.on = Node.prototype.addEventListener;

	function getQueryVar(variable) {
		var query = window.location.href.split('?')[1];
		if (!query) {
			return false;
		}
		var vars = query.split('&');
		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split('=');
			if (pair[0] === variable) {
				return pair[1];
			}
		}
		return false;
	}


	// ---------------------------------------------------------------------------

	var editor = ace.edit('editor');

	function executeCode(code) {
		post('/cgi-bin/eval.cgi', code).then(function (resp) {
			$('#output').innerHTML = resp;
		}).catch(function (err) {
			$('#output').innerHTML = 'There was a problem evaluating your code.';
			console.error(err);
		});
	}

	function shareCode(code) {
		post('/cgi-bin/share.cgi', code).then(function (resp) {
			$('#permalinkFld').value = 'http://localhost/try-red/?s=' + resp;
			showDialog($('#shareDialog'));
		}).catch(function (err) {
			$('#output').innerHTML = 'There was a problem sharing your code.';
			console.error(err);
		});
	}

	function loadCode(id) {
		get('/cgi-bin/get.cgi?s=' + id).then(function (resp) {
			editor.setValue(resp);
		}).catch(function (err) {
			$('#output').innerHTML = 'There was a problem loading this code.';
			console.error(err);
		});
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
		editor.setTheme('ace/theme/twilight');
		editor.session.setMode('ace/mode/plain_text');

		$('#runBtn').on('click', function (evt) {
			executeCode(editor.getValue());
		});
		document.documentElement.on('keydown', function (evt) {
			if (evt.ctrlKey && evt.which === 13) {
				executeCode(editor.getValue());
			}
		});

		$('#shareBtn').on('click', function (evt) {
			shareCode(editor.getValue());
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
			});
		});

		var clipboard = new Clipboard('#copyBtn', {
			target: function () {
				return $('#permalinkFld');
			}
		});

		clipboard.on('success', function(e) {
			$('#copyStatus').innerHTML = 'Copied!';
			setTimeout(function () {
				$('#copyStatus').innerHTML = '';
			}, 2000);
			e.clearSelection();
		});

		clipboard.on('error', function(e) {
			$('#copyStatus').innerHTML = 'Not copied. Press ctrl+c to copy.';
			setTimeout(function () {
				$('#copyStatus').innerHTML = '';
			}, 2000);
		});

		var sId = getQueryVar('s');
		if (sId) {
			loadCode(sId);
		}
	}


	// http://stackoverflow.com/a/27047981/2486583
	var d = document.documentElement.style;
	if (('flexWrap' in d) || ('WebkitFlexWrap' in d) || ('msFlexWrap' in d)){
		// alert('ok');
	} else {
		alert('You don\'t appear to be using a browser that supports flexbox. Things may still function, but you will most likely see layout issues.');
	}

	// Checks for IE 8
	var test = {
		addEventListener : !!window.addEventListener,
		querySelectorAll : !!document.querySelectorAll,
	};
	if (test.addEventListener && test.querySelectorAll) {
		ready(init);
	} else {
		alert('You appear to be using a very old browser. To use this app, please upgrade to at least Internet Explorer 9 or a more modern browser.');
	}

}());
