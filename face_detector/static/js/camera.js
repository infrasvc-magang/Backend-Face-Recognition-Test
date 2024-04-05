// seleksi elemen video
var video = document.querySelector("#video-webcam");




// minta izin user
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;

// jika user memberikan izin
if (navigator.getUserMedia) {
    // jalankan fungsi handleVideo, dan videoError jika izin ditolak
    navigator.getUserMedia({ video: {height: 350, width: 885,} }, handleVideo, videoError);
}

// fungsi ini akan dieksekusi jika  izin telah diberikan
function handleVideo(stream) {
    video.srcObject = stream;
}

// fungsi ini akan dieksekusi kalau user menolak izin
function videoError(e) {
    // do something
    alert("Izinkan menggunakan webcam untuk demo!")
}

// Membuat objek SpeechRecognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

// Mengatur properti continuous dan interimResults menjadi true
recognition.lang = "id-ID"; // Set the language to English
recognition.interimResults = true; // Disable interim results
recognition.continuous = true; // Stop listening after one utterance
recognition.maxAlternatives = 1; // Stop listening after one utterance

// Membuat fungsi callback untuk menangani hasil pengenalan suara


	// Add a function to show the loading icon when the system is listening


// Membuat fungsi untuk mendapatkan stream audio lokal
function getLocalStream() {
  navigator.mediaDevices
    .getUserMedia({ video: false, audio: true })
    .then((stream) => {
      window.localStream = stream;
      window.localAudio.srcObject = stream;
      window.localAudio.autoplay = true;
    })
    .catch((err) => {
      console.error(`you got an error: ${err}`);
    });
}

// Menambahkan event listener untuk event load atau DOMContentLoaded pada objek window
window.addEventListener('load', function() {
  // Meminta izin mikrofon dan mendapatkan stream audio lokal
  getLocalStream();
  // Memulai pengenalan suara
  
});
recognition.start();
// Mengatur tab default yang aktif saat halaman dimuat
document.addEventListener("DOMContentLoaded", function() {
  // Pilih tab yang akan diatur sebagai default aktif (misalnya 'tab1')
  var defaultTab = 'tab1';

  // Temukan tab default
  var defaultTabContent = document.getElementById(defaultTab);

  // Tampilkan tab default
  defaultTabContent.classList.add("show");
});

//Voice tab layout 
document.addEventListener("DOMContentLoaded", () => {
	const chatBox = document.getElementById("chat-boxx");
	const loadingIcon = document.getElementById("load-icon");
    const micIcon = document.getElementById("mic-icon");

	function showLoadingIcon() {
		loadingIcon.style.display = "inline-block";
		loadingIcon.classList.add("loading");
		// Change the background color of the button to indicate loading status
	
	}
	
	// Add a function to hide the loading icon when the system is done listening
	function hideLoadingIcon() {
		loadingIcon.style.display = "none";
		loadingIcon.classList.remove("loading");
		// Restore the background color of the button to normal
		
	}

	function showMicIcon() {
		micIcon.style.display = "inline-block";
	}

	// Add a function to hide the mic icon when the system is listening
	function hideMicIcon() {
		micIcon.style.display = "none";
	}

	// Fungsi untuk menampilkan pesan ke chat box
	function displayMessage(pesan, sender) {
		const messageDiv = document.createElement("div");
		messageDiv.classList.add("pesan");
		// Membuat textarea untuk menampilkan pesan
		const messageBox = document.createElement("textarea");
		messageBox.value = pesan;
		messageBox.readOnly = true; // Membuat textarea tidak dapat diedit
		// Mengatur baris dan kolom textarea sesuai dengan panjang pesan
		messageBox.rows = Math.ceil(pesan.length / 60); // Anggap satu baris bisa menampung maksimal 40 karakter
		messageBox.cols = Math.min(pesan.length, 60); // Jika pesan lebih pendek dari 40 karakter, maka kolom disesuaikan
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

	function typeMessage(pesan, sender) {
		let i = 0;
		const typingSpeed = 50; // Kecepatan mengetik dalam milidetik
		const messageDiv = document.createElement("div");
		messageDiv.classList.add("pesan");
		// Membuat textarea untuk menampilkan pesan
		const messageBox = document.createElement("textarea");
		messageBox.readOnly = true; // Membuat textarea tidak dapat diedit
		// Mengatur baris dan kolom textarea sesuai dengan panjang pesan
		messageBox.rows = Math.ceil(pesan.length / 90); // Anggap satu baris bisa menampung maksimal 40 karakter
		messageBox.cols = Math.min(pesan.length, 90); // Jika pesan lebih pendek dari 40 karakter, maka kolom disesuaikan
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
			if (i < pesan.length) {
				messageBox.value += pesan.charAt(i);
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

	function micspeec() {
		// Membuat objek SpeechRecognition
		const SpeechReco = window.SpeechRecognition || window.webkitSpeechRecognition;
		const rec = new SpeechReco();

		// Mengatur properti continuous dan interimResults menjadi true
		rec.lang = "id-ID"; // Set the language to English
		rec.interimResults = false; // Disable interim results
		rec.continuous = true; // Stop listening after one utterance
		rec.maxAlternatives = 1; // Stop listening after one utterance
		
		hideLoadingIcon();
		showMicIcon();
		rec.start();

		rec.onresult = function(event) {
			// Mendapatkan hasil terakhir dari pengenalan suara
			const lastt = event.results.length - 1;
			const resultt = event.results[lastt][0].transcript;
		  
			typeMessage(resultt, 'user');
			showLoadingIcon();
			hideMicIcon();
			$.ajax({
				type: "POST",
				url: "http://127.0.0.1:8000/postdata/", // Update with the correct URL endpoint in your Django app
				data: { message: resultt },
				success: function (data) {
					console.log("Response from server:", data);
					typeMessage(data.response + "\n Silahkan katakan oke jika sudah selesai", "bot");
					rec.stop();
					if ('speechSynthesis' in window) {
						const utterance = new SpeechSynthesisUtterance();
						utterance.text = data.response;
						utterance.pitch = 1.5;
						utterance.rate = 0.8;
						utterance.lang = 'id-ID';
						
			
						utterance.onend = function() {
						// Setelah sintesis suara selesai, lanjutkan ke langkah berikutnya
						  hideLoadingIcon();
						  showMicIcon();
						  rec.start();
						  if(resultt === "ok"){
								document.getElementById('tab1').classList.add("show");
                            	document.getElementById('tab2').classList.remove("show");
								rec.stop();
						  }
						  
						};
			
						speechSynthesis.speak(utterance);
					} else {
						console.log("Web Speech API tidak didukung oleh browser ini.");
						// Langsung sembunyikan loading icon jika Web Speech API tidak didukung
						// $("#progres-icon").hide();
						// displayMessage("Terjadi kesalahan pada server", "bot");
						// isBotProcessing = false;
					}
					
				
				},
				error: function (error) {
					console.error("Error:", error);
					// hideLoadingIcon();
					// isBotProcessing = false;
					hideLoadingIcon();
		            showMicIcon();
				},
				
			});
			
		  };

	}

	recognition.onresult = function(event) {
		// Mendapatkan hasil terakhir dari pengenalan suara
		const last = event.results.length - 1;
		const result = event.results[last][0].transcript;
	  
		// Jika hasilnya cocok dengan kata "siri", maka berpindah ke tab lain
		if (result === 'halo') {
		    
			if ('speechSynthesis' in window) {
				const utterance = new SpeechSynthesisUtterance();
				utterance.text = "Silahkan tanyakan sesuatu";
				utterance.pitch = 1.5;
				utterance.rate = 0.8;
				utterance.lang = 'id-ID';
		
				speechSynthesis.speak(utterance);
				

				
			} else {
				console.log("Web Speech API tidak didukung oleh browser ini.");
			}
			hideMicIcon();
			showLoadingIcon();
			setTimeout(micspeec, 5000);

			

			
		   // Sembunyikan tab pertama
		    document.getElementById('tab1').classList.remove("show");
		
	  
		   // Tampilkan tab kedua
		   document.getElementById('tab2').classList.add("show");
		}
	  };
	
	 
	
	// Mengirim pesan saat tombol "Enter" ditekan

});

var timeout;

// function redirectToHomePage() {
// 	document.getElementById('tab1').classList.add("show");
// 	document.getElementById('tab2').classList.remove("show");
// }

// function resetTimer() {
// 	clearTimeout(timeout);
// 	timeout = setTimeout(redirectToHomePage, 12000); // Mengatur waktu untuk kembali ke halaman utama dalam milidetik (5 detik dalam contoh ini)
// }

// // Panggil fungsi untuk memulai timer saat halaman dimuat
// resetTimer();

// // Atur event listener untuk menghentikan timer saat ada respon
// document.addEventListener("mousemove", resetTimer);
// document.addEventListener("keydown", resetTimer);
// // Anda dapat menambahkan event listener lain sesuai dengan interaksi yang ingin Anda amati, seperti 'click', 'scroll', dll.
