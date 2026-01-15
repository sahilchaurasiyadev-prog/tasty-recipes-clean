const { HfInference } = require('@huggingface/inference');
const hf = new HfInference(''); // Replace with your API key

const testHuggingFace = async () => {
  try {
    const response = await hf.textGeneration({
      model: 'facebook/opt-1.3b',
      inputs: 'Hello, world!',
      parameters: {
        max_length: 50,
      },
    });

    console.log('Hugging Face API Response:', response);
  } catch (error) {
    console.error('Error testing Hugging Face API:', error);
  }
};

testHuggingFace();
