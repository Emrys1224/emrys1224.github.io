var categoryIndex;
var lang;
var choiceLang;
var vocabWord;
var scored = 0;
var answered = 0;
var firstTry = true;

var categoryEntries = [];
var wordsLeftIndex = [];

var categories = document.getElementById('categories');
var language = document.getElementById('language');
var score = document.getElementById('score');
var total = document.getElementById('total');
var wordGiven = document.getElementById('word-given');
var answer = document.getElementById('answer');
var ansConfirm = document.getElementById('ans-confirm');
var wordChoices = document.getElementById('word-choices');
var wordSel = document.querySelectorAll('#word-choices div button');
var vocabList = document.getElementById('vocab-list');
var showVocabBtn = document.getElementById('show-vocab-btn');
var nxtBtn = document.getElementById('nxt-btn');

/* refresh the wordsLeftIndex array
 */
function clearWordsLeftIndex() {
	wordsLeftIndex.splice(0);
	for (var i = 0; i < categoryEntries.length; i++) {
		wordsLeftIndex.push(i)
	}
}

/* update the value of category and reset lang(to "kor") variable
 * change the texts of #word-disp, #ans-confirm, and #nxt-btn
 */
function initialize() {
	categoryIndex = categories.value;

	// check if the selected category is in the vocab array
	if (categoryIndex >= vocab.length) {
		console.log('categoryIndex is out of bounds');
		console.log('Please check the vocab array');
		console.log("categoryIndex=" + categoryIndex + "; " + "vocab.length=" + vocab.length);
		categoryIndex = vocab.length - 1;
		categories.value = categoryIndex;
	}

	// store a copy of vocab entries as per category
	categoryEntries.splice(0);
	categoryEntries = vocab[categoryIndex].entries.slice();
	// console.log(categoryEntries);
	// console.log(vocab[categoryIndex].category);
	// console.log(vocab[categoryIndex].entries);

	// set language
	language.value = "kor";
	changeLang();

	// check if array is empty
	if (categoryEntries.length <= 1) {
		// update text of #ans-confirm
		ansConfirm.textContent = "This category is not available. Please choose another one.";

		// disable click event for #nxt-btn
		nxtBtn.onclick = "";
		nxtBtn.className = " disabled";

		showVocabBtn.hidden = true;
	}
	else {
		showVocabBtn.hidden = false;
	}
	ansConfirm.className = "";
	vocabList.style.display = "";
}

/* change the language
 */
function changeLang() {
	lang = language.value;

	// update choiceLang and text of #word-disp
	if (lang === "kor") {
		choiceLang = "eng";
		wordGiven.textContent = "한글";
		answer.textContent = "Hangul";
	}
	else if (lang = "eng") {
		choiceLang = "kor";
		wordGiven.textContent = "English";
		answer.textContent = "영어";
	}
	else {
		console.log("Check the value of #language");
		console.log(lang);
	}

	clearWordsLeftIndex();
	// console.log("a => " + wordsLeftIndex);

	// console.log(categoryIndex + " ; " + lang);

	// update text of #ans-confirm
	ansConfirm.textContent = "Press \"Start\" button to continue";

	// hide #word-choices
	wordChoices.hidden = true;

	// show #show-vocab-btn
	if (!vocabList.style.display) {
		showVocabBtn.hidden = false;
	}

	// update text of #nxt-btn
	nxtBtn.textContent = "Start";

	// enable click event for #nxt-btn
	nxtBtn.onclick = function onclick(event) { setWordGiven() };;
	nxtBtn.className = "";
}

/* build and show the #vocab-list
 */
function showVocabList() {
	// category title
	var vocabHTML = "<h3>" + vocab[categoryIndex].category + "</h3><ul>";

	// vocab entry list
	categoryEntries.forEach(function (entry, i) {
		// lighten the shade of background of every even index
		var shade = ""
		if (i % 2 === 0) {
			shade = "light";
		}
		vocabHTML += "<li class='entry " + shade + "'><div>" + entry.eng + "</div><div>" + entry.kor + "</div></li>";
	})

	vocabList.innerHTML = vocabHTML + "</ul>";
	vocabList.style.display = "block";
	showVocabBtn.hidden = true;
}

/* update the #word-given and the the choices(.word-sel)
 */
function setWordGiven() {
	// update wordsLeftIndex if all words in categoryEntries has been given
	if (wordsLeftIndex.length === 0) {
		clearWordsLeftIndex();
		// console.log("b => " + wordsLeftIndex);

		// update text displayed
		wordGiven.textContent = "Finished!";
		answer.textContent = "";
		ansConfirm.innerHTML = "You've got <span class='final-score'>" + scored + "</span> out of <span class='final-score'>" + answered + "</span>";
		ansConfirm.className = "";
		showVocabBtn.hidden = false;
		nxtBtn.textContent = "Continue";

		// clear score
		total.textContent = score.textContent = answered = scored = 0;

		// hide #word-choices
		wordChoices.hidden = true;
	}
	else {
		var vocabWordIndex;
		var arrChoicesIndexes = [];

		// randomly choose a word in the array
		var randIndex = Math.floor(Math.random() * wordsLeftIndex.length);
		// console.log("r => " + randIndex);
		vocabWordIndex = wordsLeftIndex[randIndex];
		// console.log("v => " + vocabWordIndex);
		vocabWord = categoryEntries[vocabWordIndex];
		arrChoicesIndexes.push(vocabWordIndex);
		// console.log(wordsLeftIndex.indexOf(vocabWordIndex));
		wordsLeftIndex.splice(wordsLeftIndex.indexOf(vocabWordIndex), 1);
		// console.log("c => " + wordsLeftIndex);


		// choose three additional random indexes for choices
		for (var i = 0; i < 3; i++) {
			var accepted = false;

			// make sure that the index has not been selected
			while (!accepted) {
				var newChoiceIndex = Math.floor(Math.random() * categoryEntries.length);

				if (arrChoicesIndexes.indexOf(newChoiceIndex) === -1) {
					arrChoicesIndexes.push(newChoiceIndex);
					accepted = true;
				}
			}
		}
		// console.log(arrChoicesIndexes);

		// swap the location of the correct answer to a random choice index
		var ansIndex = Math.floor(Math.random() * arrChoicesIndexes.length);
		var temp = arrChoicesIndexes[0];
		arrChoicesIndexes[0] = arrChoicesIndexes[ansIndex];
		arrChoicesIndexes[ansIndex] = temp;
		// console.log(arrChoicesIndexes);

		// update texts
		wordGiven.textContent = vocabWord[lang];
		answer.textContent = "";
		ansConfirm.innerHTML = "";
		nxtBtn.textContent = "Next";

		// display the choices
		wordChoices.hidden = false;
		arrChoicesIndexes.forEach(function (choiceIndex, i) {
			var choice = categoryEntries[choiceIndex][choiceLang];
			// console.log(choiceIndex + " => " + choice);

			wordSel[i].textContent = choice;

			// set font-size
			var fontSize = 20;
			wordSel[i].className = "";
			wordSel[i].style.fontSize = fontSize + "px";
			// console.log(wordSel[i].textContent + " => " + wordSel[i].clientWidth);

			// prevent text overflow
			while (wordSel[i].clientWidth > 228) {
				fontSize--;
				wordSel[i].style.fontSize = fontSize + "px";
			}

			// reset style
			wordSel[i].className = "word-sel";

			// enable click event for .word-sel
			wordSel[i].onclick = function onclick(event) { checkAns(this) };
		})

		// hide #vocab-list and #show-vocab-btn
		vocabList.style.display = "";
		showVocabBtn.hidden = true;

		// disable click event for #nxt-btn
		nxtBtn.onclick = "";
		nxtBtn.className = " disabled";
	}
}

/* check if the answer is correct
 */
function checkAns(choiceBtn) {
	// disable click event for the choice selected
	choiceBtn.onclick = "";
	choiceBtn.className += " disabled";

	// check if the answer is correct
	var selAns = choiceBtn.textContent;
	var correctAns = vocabWord[choiceLang];
	// console.log(selAns + " => " + correctAns);

	if (selAns === correctAns) {
		// update score
		if (firstTry) {
			scored++;
			score.textContent = scored;
		}
		answered++;
		total.textContent = answered;
		firstTry = true;

		// update text displayed
		answer.textContent = correctAns;
		ansConfirm.textContent = "You got it right!";
		ansConfirm.className = "correct";
		choiceBtn.className += " correct-ans";

		// disable click event for .word-sel
		for (var i = 0; i < wordSel.length; i++) {
			wordSel[i].onclick = "";
			wordSel[i].className += " disabled";
		}

		// enable click event for #nxt-btn
		nxtBtn.onclick = function onclick(event) { setWordGiven() };
		nxtBtn.className = "";
	}
	else {
		firstTry = false;

		ansConfirm.textContent = "Wrong answer. Try again.";
		ansConfirm.className = "wrong";

		choiceBtn.className += " choice-sel";
	}
}

initialize();