import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";

export const GET = async (request, context) => {
    try {
        const { id } = await context.params;

        console.log("Fetching prompts for creator ID:", id); // Debugging

        await connectToDB();

        const prompts = await Prompt.find({
            creator: id,
        }).populate("creator");

        return new Response(JSON.stringify(prompts), { status: 200 });
    } catch (error) {
        console.error("Error fetching prompts:", error); // Debugging
        return new Response("Failed to fetch all prompts", { status: 500 });
    }
};
