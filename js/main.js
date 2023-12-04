const app = Vue.createApp({
	data() {
		return {
			img_url: null,
			kernel_size: 1
		}
	},
	mounted(){
		this.img_url = "../img/lustre.png";
	},
	methods: {
		loadimg(e){
			this.img_url = URL.createObjectURL(e.target.files[0]);
		},
	},
});
