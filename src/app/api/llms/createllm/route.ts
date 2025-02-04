import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Llm from "@/models/llmModel";
import User from "@/models/userModel";
import axios from "axios";

connect();

export async function POST(request: NextRequest) {
    try {
        // Parse JSON request body
        let createLLMData = await request.json();
        /* 
        body -  {
                llmName: 'nextJS Server',
                baseModel: 'unsloth/Meta-Llama-3.1-8B-bnb-4bit',
                description: 'asdasdasdsaads',
                modelParams: {
                    r: 16,
                    target_modules: [ 'q_proj' ],
                    lora_alpha: 16,
                    lora_dropout: 0,
                    bias: 'none',
                    use_gradient_checkpointing: 'unsloth',
                    random_state: 3407,
                    use_rslora: false
                },
                trainingArguments: {
                    per_device_train_batch_size: 2,
                    gradient_accumulation_steps: 4,
                    warmup_steps: 5,
                    max_steps: 200,
                    learning_rate: 0.0002,
                    logging_steps: 10,
                    optim: 'adamw_8bit',
                    weight_decay: 0.01,
                    lr_scheduler_type: 'linear',
                    seed: 3407,
                    output_dir: 'outputs',
                    report_to: 'none'
                },
                inputColValue: 'prompt,completion',
                inputColType: 'Input Column,Target'
                inputCol: prompt
                targetCol: completion
                }
        */
        
        // Construct LLM data (no unnecessary JSON.stringify())

        console.log("Sending to AWS:", createLLMData);
        console.log(`Sending POST REQUEST to - ${process.env.AWS_PUBLIC_IP}/aws` );
        
        // AWS Public IP - Flask server
        const awsResponse = await axios.post(
            // 1. rm folders -> 
            // 2. fine-tune 
            // 3. save the mode 
            // 4. ollama create LegacyPaul0809/{name}
            // 5. ollama push LegacyPaul0809/{name}
            `${process.env.AWS_PUBLIC_IP}/aws`, //aws = fine-tune
            createLLMData,
            { timeout: 1800000 } // 30 minutes
        );
        
        console.log("AWS Response:", awsResponse.data);
        return NextResponse.json({ message: "Fine-Tuning Process has begun..", success: true }, { status: 200 });        

    } catch (error: any) {
        console.error("Error:", error.message);

        if (error.response) {
            console.error("AWS Error Response:", error.response.data);
        }
        return NextResponse.json({ error: "Error occurred: " + error.message, success: false }, { status: 500 });
    }
}
