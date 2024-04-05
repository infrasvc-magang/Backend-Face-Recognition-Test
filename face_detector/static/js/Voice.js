document.addEventListener("DOMContentLoaded", () => {
	const chatBox = document.getElementById("chat-box");
	const inputBox = document.getElementById("input-box");
	// Get the reference to the voice button element
	const voiceButton = document.getElementById("voice-button");
	// Get the reference to the loading icon element
	const loadingIcon = document.getElementById("loading-icon");
	// Get the reference to the mic icon element
	const micIcon = document.getElementById("mic-icon");

	// Fungsi untuk menampilkan pesan ke chat box
	function displayMessage(message, sender) {
		const messageDiv = document.createElement("div");
		messageDiv.classList.add("message");
		// Membuat textarea untuk menampilkan pesan
		const messageBox = document.createElement("textarea");
		messageBox.value = message;
		messageBox.readOnly = true; // Membuat textarea tidak dapat diedit
		// Mengatur baris dan kolom textarea sesuai dengan panjang pesan
		messageBox.rows = Math.ceil(message.length / 90); // Anggap satu baris bisa menampung maksimal 40 karakter
		messageBox.cols = Math.min(message.length, 90); // Jika pesan lebih pendek dari 40 karakter, maka kolom disesuaikan
		// Menambahkan atribut wrap="hard" pada textarea
		messageBox.setAttribute("wrap", "hard");
		messageDiv.appendChild(messageBox);
		if (sender === "user") {
			// Jika pengirim adalah user, maka pesan diletakkan di sebelah kanan
			messageDiv.style.textAlign = "right";
			// Menambahkan kelas user-text pada textarea user
			messageBox.classList.add("user-text");
		} else {
			// Jika pengirim adalah bot, maka pesan diletakkan di sebelah kiri
			messageDiv.style.textAlign = "left";
			// Menambahkan kelas bot-text pada textarea bot
			messageBox.classList.add("bot-text");
		}
		chatBox.appendChild(messageDiv);
		chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll ke bawah
	}

	let isBotProcessing = false;

	// Untuk mengganti icon mic ke icon sent
	inputBox.addEventListener("input", () => {
		if (inputBox.value.trim() !== "" ) {
			voiceButton.innerHTML = '<i class="fa fa-paper-plane"></i>';
		} else {
			voiceButton.innerHTML = '<i class="fas fa-microphone"></i>';
		}
	});

	voiceButton.addEventListener("click", () => {
		if (voiceButton.innerHTML === '<i class="fa fa-paper-plane"></i>') {
			isBotProcessing = true;
			// Handle voice recording logic here
			// For simplicity, let's assume it's sending a voice note
			// Simulate sending the voice note
			// 	const voiceNote = document.createElement("div");
			// 	voiceNote.textContent = "Voice Note Sent";
			// 	messagesContainer.appendChild(voiceNote);
			// } else {
			// Handle sending text message
			const messageText = inputBox.value.trim();

			if (messageText !== "" ) {
				
				// const message = document.createElement("div");
				// message.textContent = messageText;
				// chatBox.appendChild(message);
				// inputBox.value = "";
				// sendButton.innerHTML === '<i class="fas fa-microphone"></i>'; // Reset button text
				sendMessage(messageText);
				
			} else {
				startVoiceRecognition();
			}
		}
	});

	function sendMessage(messageText) {
		displayMessage(messageText, "user");
		inputBox.value = "";
		voiceButton.innerHTML = '<i class="fas fa-microphone"></i>'; // Reset button text
	}

	function typeMessage(message, sender) {
		let i = 0;
		const typingSpeed = 100; // Kecepatan mengetik dalam milidetik
		const messageDiv = document.createElement("div");
		messageDiv.classList.add("message");
		// Membuat textarea untuk menampilkan pesan
		const messageBox = document.createElement("textarea");
		messageBox.readOnly = true; // Membuat textarea tidak dapat diedit
		// Mengatur baris dan kolom textarea sesuai dengan panjang pesan
		messageBox.rows = Math.ceil(message.length / 90); // Anggap satu baris bisa menampung maksimal 40 karakter
		messageBox.cols = Math.min(message.length, 90); // Jika pesan lebih pendek dari 40 karakter, maka kolom disesuaikan
		// Menambahkan atribut wrap="hard" pada textarea
		messageBox.setAttribute("wrap", "hard");
		messageDiv.appendChild(messageBox);
		if (sender === "user") {
			// Jika pengirim adalah user, maka pesan diletakkan di sebelah kanan
			messageDiv.style.textAlign = "right";
			// Menambahkan kelas user-text pada textarea user
			messageBox.classList.add("user-text");
		} else {
			// Jika pengirim adalah bot, maka pesan diletakkan di sebelah kiri
			messageDiv.style.textAlign = "left";
			// Menambahkan kelas bot-text pada textarea bot
			messageBox.classList.add("bot-text");
		}
		chatBox.appendChild(messageDiv);
		chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll ke bawah

		function typeChar() {
			if (i < message.length) {
				messageBox.value += message.charAt(i);
				i++;
				setTimeout(typeChar, typingSpeed);
			}
		}

		typeChar();
	}

	typeMessage(
		"Selamat datang di voice command Experience Center!, Apa yang bisa saya bantu?",
		"bot"
	);

	
	
	// Mengirim pesan saat tombol "Enter" ditekan
	
	
	inputBox.addEventListener("keypress", (event) => {
		if (event.key === "Enter" && !isBotProcessing) {
		  voiceButton.innerHTML = '<i class="fas fa-microphone"></i>';
		  isBotProcessing = true;
		  const message = inputBox.value;
		  inputBox.value = "";
		  displayMessage(message, "user");
		  $("#progres-icon").show();
		  $("#progres-icon").css({
			right: "400px",
			top: "655px",
			position: "absolute",
			margin: "5px",
			color: "#0077FF",
		  });
	  
		  $.ajax({
			type: "POST",
			url: "http://127.0.0.1:8000/postdata/", // Ganti dengan URL yang benar
			data: { message: message },
			success: function (data) {
			  console.log("Response from server:", data);
			  displayMessage(data.response, "bot");
	  
			  if ('speechSynthesis' in window) {
				const utterance = new SpeechSynthesisUtterance();
				utterance.text = data.response;
				utterance.pitch = 1.5;
				utterance.rate = 0.8;
				utterance.lang = 'id-ID';
				utterance.onend = function() {
				  // Setelah sintesis suara selesai, lanjutkan ke langkah berikutnya
				  $("#progres-icon").hide();
				  isBotProcessing = false;
				};
	  
				speechSynthesis.speak(utterance);
			  } else {
				console.log("Web Speech API tidak didukung oleh browser ini.");
				displayMessage("Terjadi kesalahan pada server", "bot");
				// Langsung sembunyikan loading icon jika Web Speech API tidak didukung
				$("#progres-icon").hide();
				isBotProcessing = false;
			  }
			},
			error: function (error) {
			  console.error("Error:", error);
			  displayMessage("Terjadi kesalahan pada server", "bot");
			  $("#progres-icon").hide();
			  isBotProcessing = false;
			},
		  });
		}
	});

	// Create a variable to store the reference to the SpeechRecognition object
	const recognition = new webkitSpeechRecognition(); // Use a vendor prefix if needed
	// Set some properties of the recognition object
	recognition.lang = "id-ID"; // Set the language to English
	recognition.interimResults = false; // Disable interim results
	recognition.continuous = true; // Stop listening after one utterance
	recognition.maxAlternatives = 1; // Stop listening after one utterance

	// Add an event listener to the voice button that will start the recognition process when clicked
	voiceButton.addEventListener("mousedown", () => {
		if (!isBotProcessing) {
			recognition.start();
			isBotProcessing = true;
		}
	});

	// Add an event listener to the voice button that will stop the recognition process when released
	voiceButton.addEventListener("mouseup", () => {
		recognition.stop();
		isBotProcessing = false;
	});

	// Add an event listener to the recognition object that will handle the result event
	recognition.addEventListener("result", (event) => {
		// Get the transcript of the speech from the event object
		const transcript = event.results[0][0].transcript;
		// Display the transcript in the chat box as a user message
		displayMessage(transcript, "user");
		$("#progres-icon").show();
		  $("#progres-icon").css({
			right: "400px",
			top: "655px",
			position: "absolute",
			margin: "5px",
			color: "#0077FF",
		  });
		// Add a setTimeout function that will display a bot message after a delay
		showLoadingIcon();
		$.ajax({
			type: "POST",
			url: "http://127.0.0.1:8000/postdata/", // Update with the correct URL endpoint in your Django app
			data: { message: transcript },
			success: function (data) {
				console.log("Response from server:", data);
				displayMessage(data.response, "bot");
				if ('speechSynthesis' in window) {
					const utterance = new SpeechSynthesisUtterance();
					utterance.text = data.response;
					utterance.pitch = 1.5;
					utterance.rate = 0.8;
					utterance.lang = 'id-ID';
		  
					utterance.onend = function() {
					  // Setelah sintesis suara selesai, lanjutkan ke langkah berikutnya
					  $("#progres-icon").hide();
					  isBotProcessing = false;
					};
		  
					speechSynthesis.speak(utterance);
				  } else {
					console.log("Web Speech API tidak didukung oleh browser ini.");
					// Langsung sembunyikan loading icon jika Web Speech API tidak didukung
					$("#progres-icon").hide();
					displayMessage("Terjadi kesalahan pada server", "bot");
					isBotProcessing = false;
				  }
				hideLoadingIcon();
				isBotProcessing = false;
			},
			error: function (error) {
				console.error("Error:", error);
				hideLoadingIcon();
				isBotProcessing = false;
			},
		});
	});

	// Optionally, add event listeners for other events, such as error, end, or nomatch, and handle them accordingly

	// Add a function to show the loading icon when the system is listening
	function showLoadingIcon() {
		loadingIcon.style.display = "inline-block";
		loadingIcon.classList.add("loading");
		// Change the background color of the button to indicate loading status
		voiceButton.style.backgroundColor = "#00AAFF";
	}

	// Add a function to hide the loading icon when the system is done listening
	function hideLoadingIcon() {
		loadingIcon.style.display = "none";
		loadingIcon.classList.remove("loading");
		// Restore the background color of the button to normal
		voiceButton.style.backgroundColor = "#0077FF";
	}

	// Add a function to show the mic icon when the system is not listening
	function showMicIcon() {
		micIcon.style.display = "inline-block";
	}

	// Add a function to hide the mic icon when the system is listening
	function hideMicIcon() {
		micIcon.style.display = "none";
	}

	// Add an event listener to the recognition object that will call the showLoadingIcon and hideMicIcon functions when the system starts listening
	recognition.addEventListener("start", () => {
		showLoadingIcon();
		hideMicIcon();
	});

	// Add an event listener to the recognition object that will call the hideLoadingIcon and showMicIcon functions when the system stops listening
	recognition.addEventListener("end", () => {
		hideLoadingIcon();
		showMicIcon();
	});
});
var timeout;

// function redirectToHomePage() {
// 	window.location.href = "./";
// }

// function resetTimer() {
// 	clearTimeout(timeout);
// 	timeout = setTimeout(redirectToHomePage, 12000); // Mengatur waktu untuk kembali ke halaman utama dalam milidetik (5 detik dalam contoh ini)
// }

// // Panggil fungsi untuk memulai timer saat halaman dimuat
// resetTimer();

// Atur event listener untuk menghentikan timer saat ada respon
document.addEventListener("mousemove", resetTimer);
document.addEventListener("keydown", resetTimer);
// Anda dapat menambahkan event listener lain sesuai dengan interaksi yang ingin Anda amati, seperti 'click', 'scroll', dll.
