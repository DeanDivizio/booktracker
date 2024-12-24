"use server";
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DeleteCommand, DynamoDBDocumentClient, PutCommand, ScanCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { auth } from "@clerk/nextjs/server"
import { BookType } from '@/lib/types';

// from here to line 25 is just AWS SDK setup
const accessKeyId = process.env.AWS_KEY_ID!;
const secretAccessKey = process.env.AWS_KEY!;
const region = process.env.AWS_REGION!;
const table = process.env.AWS_TABLE!;
const productionID = process.env.PROD_ID;
const developmentID = process.env.DEV_ID;

if (!accessKeyId || !secretAccessKey || !region) {
  throw new Error('AWS credentials, table, and region must be set in environment variables.');
}
const client = new DynamoDBClient({
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  region,
});
const docClient = DynamoDBDocumentClient.from(client);

// add a book to the database
export async function AddBookAction(Book:BookType) {
    const { userId } = await auth();
    // since this app is single user, I only want to allow requests from my userId
    // Clerk provides a restriceted sign up mode but better to be safe than sorry, especially since server actions are public
    if (userId){
    if (userId === productionID || developmentID){
        const command = new PutCommand({
            TableName: table,
            Item: Book
          });
          const response = await docClient.send(command);
          console.log(response);
          return response;
    } else {
        return ("User is not signed in")
    }}
  };
  
  // pull all books in your database
  export async function GetAllBooks() {
    const { userId } = await auth();
    if (userId === developmentID || productionID){
        try {const params = {
          TableName: table,
        };
        const command = new ScanCommand(params);
        const response = await client.send(command);
        console.log(response.Items);
        return response.Items;
    } catch (error) {
        console.error(error);
    }
    } else {
        return ("User is not signed in")}
  }
  
  export async function UpdateBookAction(updatedBook: BookType) {
    const { userId } = await auth();
    // Since this app is single user, I only want to allow requests from my userId
    // Clerk provides a restricted sign-up mode but better to be safe than sorry, especially since server actions are public
    if (userId) {
    if (userId === productionID || userId === developmentID) {
        const key = {
            title: updatedBook.title,
            author: updatedBook.author
        };

        let updateExpressionParts:any[] = [];
        const expressionAttributeNames:any = {};
        const expressionAttributeValues:any = {};

        // Dynamically build the UpdateExpression, ExpressionAttributeNames, and ExpressionAttributeValues
        Object.keys(updatedBook).forEach((attr) => {
            if (attr !== 'title' && attr !== "author") { // Skip the primary and sort keys
                const placeholder = `:val${updateExpressionParts.length + 1}`;
                updateExpressionParts.push(`#${attr} = ${placeholder}`);
                expressionAttributeNames[`#${attr}`] = attr;
                // @ts-ignore
                expressionAttributeValues[placeholder] = updatedBook[attr];
            }
        });

        // construct the update command
        const command = new UpdateCommand({
            TableName: table,
            Key: key,
            UpdateExpression: `set ${updateExpressionParts.join(', ')}`,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: "UPDATED_NEW"
        });

        try {
            const response = await docClient.send(command);
            return response;
        } catch (error) {
            console.error("Command:", command);
            console.error("Unable to update item. Error JSON:", JSON.stringify(error, null, 2));
            throw error;
        }
    } else {
        return "User is not signed in";
    }}
}

// Delete an item from the database
export async function DeleteBookAction( title: string, author: string) {
    const { userId } = await auth();
    // since this app is single user, I only want to allow requests from my userId
    if (userId) {
    if (userId === productionID || developmentID){
        const key = {
            title: title,
            author: author
        };

        const command = new DeleteCommand({
            TableName: table,
            Key: key
        });
        
        try {
          const response = await docClient.send(command);
          console.log(response);
          return response;
        } catch (err) {
          throw err;
        }
    } else {
        return ("User is not signed in");
    }}
}