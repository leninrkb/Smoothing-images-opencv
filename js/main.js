const app = Vue.createApp({
	data() {
		return {
			img_url: null,
			media_kernel_size: 1,
			mediana_kernel_size: 1,
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
		clearCanvas(name){
			let canvas = document.getElementById(name);
			let ctx = canvas.getContext('2d');
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		},
		do_something(){
			let img = cv.imread(this.img_element);
			this.media(img);
			this.mediana(img);
			img.delete();
		},
		media(img){
			let result = new cv.Mat(img.rows, img.cols, img.type());
			let kernelSize = this.media_kernel_size;
			let kernelArea = kernelSize * kernelSize;
			for (let y = Math.floor(kernelSize / 2); y < img.rows - Math.floor(kernelSize / 2); y++) {
				for (let x = Math.floor(kernelSize / 2); x < img.cols - Math.floor(kernelSize / 2); x++) {
					let sumR = 0, sumG = 0, sumB = 0, sumA = 0;
					for (let ky = -Math.floor(kernelSize / 2); ky <= Math.floor(kernelSize / 2); ky++) {
						for (let kx = -Math.floor(kernelSize / 2); kx <= Math.floor(kernelSize / 2); kx++) {
							let pixel = img.ucharPtr(y + ky, x + kx);
							sumR += pixel[0];
							sumG += pixel[1];
							sumB += pixel[2];
							sumA += pixel[3];
						}
					}
					let i = result.ucharPtr(y, x);
					i[0] = sumR / kernelArea;
					i[1] = sumG / kernelArea;
					i[2] = sumB / kernelArea;
					i[3] = sumA / kernelArea;
				}
			}
			cv.imshow('media', result);
			result.delete();

		},
		mediana(img) {
			let result = new cv.Mat(img.rows, img.cols, img.type());
			let kernelSize = this.mediana_kernel_size;
			for (let y = Math.floor(kernelSize / 2); y < img.rows - Math.floor(kernelSize / 2); y++) {
				for (let x = Math.floor(kernelSize / 2); x < img.cols - Math.floor(kernelSize / 2); x++) {
					let valuesR = [], valuesG = [], valuesB = [], valuesA = [];
					for (let ky = -Math.floor(kernelSize / 2); ky <= Math.floor(kernelSize / 2); ky++) {
						for (let kx = -Math.floor(kernelSize / 2); kx <= Math.floor(kernelSize / 2); kx++) {
							let pixel = img.ucharPtr(y + ky, x + kx);
							valuesR.push(pixel[0]);
							valuesG.push(pixel[1]);
							valuesB.push(pixel[2]);
							valuesA.push(pixel[3]);
						}
					}
					valuesR.sort((a, b) => a - b);
					valuesG.sort((a, b) => a - b);
					valuesB.sort((a, b) => a - b);
					valuesA.sort((a, b) => a - b);
					let i = result.ucharPtr(y, x);
					i[0] = valuesR[Math.floor(valuesR.length / 2)];
					i[1] = valuesG[Math.floor(valuesG.length / 2)];
					i[2] = valuesB[Math.floor(valuesB.length / 2)];
					i[3] = valuesA[Math.floor(valuesA.length / 2)];
				}
			}
			cv.imshow('mediana', result);
			result.delete();
		},
	},
});
