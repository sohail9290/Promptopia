import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";

// GET method
export const GET = async (request, context) => {
    try {
        const { id } = await context.params; // Await `context.params`

        console.log("Fetching prompt with ID:", id); // Debugging

        await connectToDB();

        const prompt = await Prompt.findById(id).populate("creator");
        if (!prompt) return new Response("Prompt Not Found", { status: 404 });

        return new Response(JSON.stringify(prompt), { status: 200 });
    } catch (error) {
        console.error("Error fetching prompt:", error); // Debugging
        return new Response("Internal Server Error", { status: 500 });
    }
};

// PATCH method
export const PATCH = async (request, context) => {
    try {
        const { id } = await context.params; // Await `context.params`
        const { prompt, tag } = await request.json();

        console.log("Updating prompt with ID:", id); // Debugging

        await connectToDB();

        const existingPrompt = await Prompt.findById(id);
        if (!existingPrompt) {
            return new Response("Prompt not found", { status: 404 });
        }

        // Update the prompt details
        existingPrompt.prompt = prompt;
        existingPrompt.tag = tag;

        await existingPrompt.save();

        return new Response(JSON.stringify(existingPrompt), { status: 200 });
    } catch (error) {
        console.error("Error updating prompt:", error); // Debugging
        return new Response("Error Updating Prompt", { status: 500 });
    }
};

// DELETE method
export const DELETE = async (request, context) => {
    try {
        const { id } = await context.params; // Await `context.params`

        console.log("Deleting prompt with ID:", id); // Debugging

        await connectToDB();

        // Use `findByIdAndDelete` instead of `findByIdAndRemove`
        await Prompt.findByIdAndDelete(id);

        return new Response("Prompt deleted successfully", { status: 200 });
    } catch (error) {
        console.error("Error deleting prompt:", error); // Debugging
        return new Response("Error deleting prompt", { status: 500 });
    }
};
