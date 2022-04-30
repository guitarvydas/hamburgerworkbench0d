
This is a (very simple) example of creating an HTML app using 0D components.

Load "hamburgerworkbench0d.html" into a browser and hit the "hamburger" button. [github](https://github.com/guitarvydas/hamburgerworkbench0d)

---

0D => zero dependency (composable)

See `hamburger0d.html`.

This is a test bench for the component `orderTaker.js`.

The test bench creates a button, which fires androgynous events into another component `phraseFaker.js` which fires faked events into `OrderTaker.js`.  The faked events are hard-wired in `phraseFaker.js`. (This is, after all, just a test bench, so we want to know *exactly* what is being fed into the UUT (Unit Under Test) `orderTaker.js`).

`OrderTaker.js` is composed of two components
1. a Container (`orderTaker.js`)
2. a Leaf (`phraseParser.js`).

`PhraseParser.js` does some heavy lifting, calling Ohm-JS to parse incoming phrases to produce parsed information (or parsing errors).

At the end of the chain, `hamburgerworkbench0d.html` pulls information from the parsed result and displays it in the `output` textarea.

The operation of the internals of components is *concurrent* (not necessarily parallel, but parallelizable)).

See, also, `hamburgerworkbench0d.drawio` for a diagram of the example.

See, also, [hamburger](https://github.com/guitarvydas/hamburger) for the same app done the usual way using HTML and JavaScript (I call this N0D (non-zero-dependency)).

Next stop: creating the complete app from a `.drawio` file and foregoing the intermediate text code.


See, also, (lots of details, you don't need to read this stuff to use the above...):
- [CALL / RETURN Spaghetti](https://guitarvydas.github.io/2020/12/09/CALL-RETURN-Spaghetti.html) for an overview of how to produce concurrency on current hardware (1st class functions, closures, ...)
- The ė working papers
	1. https://guitarvydas.github.io/2022/03/20/ė-Concurrent-Lambdas.html
	2. https://guitarvydas.github.io/2022/04/11/ė-Working-Paper-2.html
	3. https://publish.obsidian.md/programmingsimplicity/WIP/ė+-+Concurrent+Lambdas+Working+Paper+3/Table+of+Contents+ė
	4. https://guitarvydas.github.io/2022/04/12/Eh-Example-and-Internals.html
- Hamburger Workbench
	- done the usual way
	- https://publish.obsidian.md/programmingsimplicity/%25Hamburger+Workbench+-+A+Light+Introduction+to+Ohm-JS/I+Want+A+Hamburger
- Upcoming book(s).
- [obsidian blog](https://publish.obsidian.md/programmingsimplicity/Table+Of+Contents)
- [blog](https://guitarvydas.github.io) (probably being replaced by the above Obsidian blog)
- [slack](arrowgram.slack.com)
- Mastodon #programmingsimplicity if I ever get my act together (help welcomed)
- Discord if I ever get my act together (help welcomed)
