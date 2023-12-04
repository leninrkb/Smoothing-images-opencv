const app = Vue.createApp({
	data() {
		return {
			img_url: null,
			kernel_size: 1,
			img_element: null,
		}
	},
	mounted(){
		this.img_url = "../img/lustre.png";
		this.img_element = document.getElementById("img_original");
	},
	methods: {
		loadimg(e){
			this.img_url = URL.createObjectURL(e.target.files[0]);
			this.img_element = document.getElementById("img_original");
		},
		do_something(){
			let img = cv.imread(this.img_element);
			this.media();
		},
		media(){

		}
	},
});
