const app = Vue.createApp({
	data() {
		return {
			img_url: null,
			mean_kernel_size: 1,
			median_kernel_size: 1,
			gauss_kernel_size: 1,
			img_element: null,
			pnoise: 0,
			rgb: true
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
			if (this.rgb) {
				this.smoothing_rgb(img);
			}else{
				this.smoothing_gray(img);
			}
			
		},
		smoothing_rgb(img) {
			let chanels = new cv.MatVector();
			cv.split(img, chanels);
			r = chanels.get(0);
			this.noise(r);
			cv.merge(chanels, img);
			cv.imshow("noise", img);
			this.mean(img);
			this.median(img);
			this.gauss(img);
			this.fourier(img);
			img.delete();
		},
		smoothing_gray(img) {
			let gray = new cv.Mat();
			cv.cvtColor(img, gray, cv.COLOR_RGBA2GRAY);
			this.noise(gray);
			cv.imshow("noise", gray);
			this.mean(gray);
			this.median(gray);
			this.gauss(gray);
			// this.fourier(gray);
			this.robert(gray);
			this.prewitt(gray);
			this.sobel(gray);
			this.laplacian(gray);
			this.gauss_laplacian(gray);
			gray.delete();
		},
		noise(img){
			p = 1 - this.pnoise;
			for (let i = 0; i < img.rows; i++) {
				for (let j = 0; j < img.cols; j++) {
					let probability2AddNoise = Math.random();
					if (probability2AddNoise > p) {
						img.ucharPtr(i, j)[0] *= 0;	
					}
					
				}
			}
		},
		robert(img) {
			let dstx = new cv.Mat(); 
			let dsty = new cv.Mat(); 
			let kernelx = cv.matFromArray(2, 2, cv.CV_32F, [1, 0, 0, -1]);
			let kernely = cv.matFromArray(2, 2, cv.CV_32F, [0, 1, -1, 0]);
			// filter 2d solo me ayuda recorriendo la matriz y 
			// haciendo la convolucion con el kernel
			// si no toca hacer el doble for
			cv.filter2D(img, dstx, cv.CV_8U, kernelx);
			cv.filter2D(img, dsty, cv.CV_8U, kernely);
			let robert = new cv.Mat();
			cv.add(dstx, dsty, robert);
			cv.imshow('robert', robert); 
			dstx.delete();
			dsty.delete();
			kernelx.delete();
			kernely.delete();
			robert.delete();
		},
		prewitt(img) {
			let dstx = new cv.Mat();
			let dsty = new cv.Mat();
			let kernelx = cv.matFromArray(3, 3, cv.CV_32F, [-1, 0, 1, -1, 0, 1, -1, 0, 1]);
			let kernely = cv.matFromArray(3, 3, cv.CV_32F, [-1, -1, -1, 0, 0, 0, 1, 1, 1]);
			cv.filter2D(img, dstx, cv.CV_8U, kernelx);
			cv.filter2D(img, dsty, cv.CV_8U, kernely);
			let robert = new cv.Mat();
			cv.add(dstx, dsty, robert);
			cv.imshow('prewitt', robert);
			dstx.delete();
			dsty.delete();
			kernelx.delete();
			kernely.delete();
			robert.delete();
		},
		sobel(img){
			let sobelx = new cv.Mat();
			let sobely = new cv.Mat();
			cv.Sobel(img, sobelx, cv.CV_64F, 1, 0, 5, 1, 0, cv.BORDER_DEFAULT);
			cv.Sobel(img, sobely, cv.CV_64F, 0, 1, 5, 1, 0, cv.BORDER_DEFAULT);
			let sobel = new cv.Mat();
			cv.add(sobelx, sobely, sobel);
			cv.imshow('sobel', sobel); 
			sobelx.delete();
			sobely.delete();
			sobel.delete();

		},
		laplacian(img){
			let dst = new cv.Mat();
			cv.Laplacian(img, dst, cv.CV_64F, 1, 1, 0, cv.BORDER_DEFAULT);
			cv.imshow('laplacian', dst);
			dst.delete();
		},
		gauss_laplacian(src){
			//gaus normal
			let dst = new cv.Mat();
			let kernel_size = new cv.Size(3, 3);
			cv.GaussianBlur(src, dst, kernel_size, 0, 0, cv.BORDER_DEFAULT);
			let lap = new cv.Mat();
			cv.Laplacian(dst, lap, cv.CV_64F, 1, 1, 0, cv.BORDER_DEFAULT);
			cv.imshow("log",lap);
			dst.delete();
			lap.delete();
		},
		mean(img){
			let result = new cv.Mat(img.rows, img.cols, img.type());
			let kernelSize = this.mean_kernel_size;
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
			cv.imshow('mean', result);
			result.delete();
		},
		median(img) {
			let result = new cv.Mat(img.rows, img.cols, img.type());
			let kernelSize = this.median_kernel_size;
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
			cv.imshow('median', result);
			result.delete();
		},
		gauss(img){
			let result = new cv.Mat();
			let ksize = new cv.Size(this.gauss_kernel_size, this.gauss_kernel_size);
			cv.GaussianBlur(img, result, ksize, 0, 0, cv.BORDER_DEFAULT);
			cv.imshow("gauss",result);
			result.delete();
		},
		fourier(src) {
			let dst = new cv.Mat();
			let M = src.rows;
			let N = src.cols;
			let planes = new cv.MatVector();
			let plane1 = src.clone();
			let plane2 = new cv.Mat.zeros(src.size(), cv.CV_32F);
			planes.push_back(plane1);
			planes.push_back(plane2);
			let complexI = new cv.Mat();
			cv.merge(planes, complexI);
			cv.dft(complexI, complexI);
			cv.split(complexI, planes);
			let magI = new cv.Mat();
			cv.magnitude(planes.get(0), planes.get(1), magI);
			magI.convertTo(magI, cv.CV_8U);
			cv.normalize(magI, magI, 0, 255, cv.NORM_MINMAX, cv.CV_8U);
			let noiseBand = { start: 10, end: 20 };
			for (let i = 0; i < magI.rows; i++) {
				for (let j = 0; j < magI.cols; j++) {
					if (i >= noiseBand.start && i <= noiseBand.end) {
						magI.ucharPtr(i, j)[0] = 0;
					}
				}
			}
			cv.merge(planes, complexI);
			cv.idft(complexI, complexI);
			cv.split(complexI, planes);
			cv.normalize(planes.get(1), dst, 0, 255, cv.NORM_MINMAX, cv.CV_8U);
			cv.imshow("fourier", dst);
			dst.delete();
			src.delete();
			plane1.delete();
			plane2.delete();
			planes.delete();
			complexI.delete();
			magI.delete();
		},
		
	},
});
