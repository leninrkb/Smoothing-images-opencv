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
    props:["title"],
    data(){
        return{
            value: 1
        }
    },
    template:
        `
            <div>   
                <label for="name" class="font-semibold">{{title}}</label>
                <br>
                <input @change="changed" class="bg-gray-200 rounded-lg p-2" name="name" v-model="value" type="number" min="1" max="99" step="1">
            </div>
        `,
    methods:{
        changed(){
            this.$emit("value",this.value);
        },
    },
});




