$(function () {
	// Fungsi untuk menampilkan tanggal yang dipilih
	function cb(start, end) {
		$("#kt_daterangepicker_4").val(
			start.format("MMMM D, YYYY") + " - " + end.format("MMMM D, YYYY")
		);
	}

	// Tanggal awal yang ditetapkan 29 hari sebelum tanggal saat ini
	var start = moment().subtract(29, "days");
	// Tanggal akhir adalah tanggal saat ini
	var end = moment();

	// Inisialisasi DateRangePicker
	$("#kt_daterangepicker_4").daterangepicker(
		{
			startDate: start,
			endDate: end,
			ranges: {
				Today: [moment(), moment()],
				Yesterday: [moment().subtract(1, "days"), moment().subtract(1, "days")],
				"Last 7 Days": [moment().subtract(6, "days"), moment()],
				"Last 30 Days": [moment().subtract(29, "days"), moment()],
				"This Month": [moment().startOf("month"), moment().endOf("month")],
				"Last Month": [
					moment().subtract(1, "month").startOf("month"),
					moment().subtract(1, "month").endOf("month"),
				],
			},
		},
		cb
	);

	// Panggil fungsi cb untuk menampilkan tanggal awal dan akhir saat halaman dimuat
	cb(start, end);
});
