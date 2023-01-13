<template>
  <section class="min-h-screen flex items-center pt-32">
    <div class="flex">
      <div class="w-2/3 text-center mx-auto max-w-4xl">
        <h1 class="mb-4 text-4xl font-bold dark:text-white">
          Find the answer you looking for
        </h1>
        <p>
          Discover, compare and find the best match,
          masterminds and online answer for your academic research.
        </p>
        <div class=" relative mt-6">
          <form @submit.prevent="generateText">
            <input type="text"  v-model="prompt" id="prompt" @keydown.enter="generateText()" class="py-4 w-full text-black rounded-md ring-0 px-4 shadow relative" placeholder="Search Now...">
          </form>
          <svg  class="w-5 h-5 absolute right-3 top-4.5 rotate-90" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 20 20" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
          </svg>
        </div>
        <div class="w-full bg-white rounded-md my-4 p-4" v-if="outputs">
          <transition-group name="writing" tag="div" class="generated-text">
            <span v-for="(letter, index) in outputs" :key="letter+index" class="letter text-left whitespace-pre-wrap">
              {{ letter }}
            </span>
          </transition-group>
        </div>
      </div>
      <div class="w-1/3">
        <div >
          <input type="file" ref="fileInput" @change="handleFileUpload" />
        </div>
      </div>
    </div>


  </section>
</template>
<script>
import { ref } from 'vue'
import VueFileUpload from "vue-file-upload";

export default {
  data() {
    return {
      outputs: null
    }
  },
  methods: {
    handleFileUpload() {
      const input = this.$refs.fileInput;
      const file = input.files[0];

      const formData = new FormData();
      formData.append('file', file);

      const apiKey = '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';

      fetch('https://api.openai.com/v1/engines/davinci/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${apiKey}`
        },
        body: formData
      })
          .then(response => response.json())
          .then(data => {
            const jobId = data.id;
            console.log(`Fine-tuning job started: ${jobId}`);
            return jobId;
          })
          .then(jobId => {
            const intervalId = setInterval(() => {
              fetch(`https://api.openai.com/v1/jobs/${jobId}`, {
                headers: {
                  'Authorization': `Bearer ${apiKey}`
                }
              })
                  .then(response => response.json())
                  .then(data => {
                    if (data.status === 'completed') {
                      console.log(`Fine-tuning job completed: ${jobId}`);
                      clearInterval(intervalId);
                    } else {
                      console.log(`Fine-tuning job status: ${data.status}`);
                    }
                  })
                  .catch(error => {
                    console.error(error);
                  });
            }, 5000);
          })
          .catch(error => {
            console.error(error);
          });
    },
  },
  computed: {
    generatedTextArray() {
      if (!this.outputs) return []
      return this.outputs.split('')
    },
  },
  components: {
    'file-upload': VueFileUpload
  },
  setup() {
    const prompt = ref("")
    const outputs = ref("")

    async function generateText() {
      const response = await fetch('https://api.openai.com/v1/engines/text-davinci-002/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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'
        },
        body: JSON.stringify({
          prompt: prompt.value,
          max_tokens: 100,
          temperature: 0.5
        })
      })
      const json = await response.json();
      this.outputs = json.choices[0].text;
    }

    return {
      prompt,
      outputs,
      generateText
    }
  }
}
</script>
<style>
.writing-enter-active, .writing-leave-active {
  transition: all .5s;
}
.writing-enter-active .letter {
  animation: writing-animation .5s forwards;
}
@keyframes writing-animation {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
