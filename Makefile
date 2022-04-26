all:
	@echo '...' checking that all js files compile '...'
	node htmlbutton.js
	node phrasefaker.js
	node phraseparser.js
	@echo ordertaker.js is not compatible with node.js
	@echo testbench.js is not  compatible  with node.js
	@echo '...' if no errors, open browser on hamburger0d.html '...'
