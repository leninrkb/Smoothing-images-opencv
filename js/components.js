app.component("img-result", {
    props: ["title"],
    template:
        `
            <div class="w-fit transition ease-in-out hover:scale-105">
                <p class="capitalize font-semibold text-md">{{title}}</p>
                <slot></slot>
            </div>
        `
});

app.component("input-value", {
    props:["title","step","min"],
    data(){
        return{
            value: this.min
        }
    },
    template:
        `
            <div>   
                <label for="name" class="font-semibold">{{title}}</label>
                <br>
                <input @change="changed" class="bg-gray-200 rounded-lg p-2" name="name" v-model="value" type="number" :min="min" max="99" :step="step">
            </div>
        `,
    methods:{
        changed(){
            this.$emit("value",this.value);
        },
    },
});




