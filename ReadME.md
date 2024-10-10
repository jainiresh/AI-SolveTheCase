*This is a submission for the [The Pinata Challenge ](https://dev.to/challenges/pinata)*

## What I Built and Why
This is a full fledged crime investigation scenario simulation game, mocking a real life crime investigation, using AI , Email apis and PINATA , managing file uploads and displays to give you a simulation of a real investigation scenario.

Haven't each and everyone, dreamt about investigating and finding clues, leading to the ground breaking discovery of the villains/culprits, like the ones they show in the movies.

well, this one is a complete crime solver, leveraging AI to give yout the exact simulation you need, along with the frontend magic that make you feel you are investigaing a real crime scene.


## Demo
Live Deployed version : https://ai-solvethecase-clientside.onrender.com
<!-- Share a brief video overview of the project with a screen share, two minutes max.-->

## Code
Our client : https://github.com/jainiresh/AI-SolveTheCase-Client
Our server : https://github.com/jainiresh/AI-SolveTheCase

{% embed https://github.com/jainiresh/AI-SolveTheCase-Client %}
{% embed https://github.com/jainiresh/AI-SolveTheCase %}

## Feature Workflows

Since this is a crime investigating simulation game, we used Nylas API and an AI agent to form a thread of emails, for each case, which has the content of the crime story, context, input or the investigation , along with a descriptive image of the crime.

Each of the case that you newly open, a new thread is opened for the current user, and is maintained throughout untill the case gets solved.

There are a lot of features implemented here, which will be discussed below.

Here is a sample workflow,


- Sign in to your account :


![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/jfw3l12ga12n5whitqo1.png)

- Make sure you provide access to your account, and proceed.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/do9lewvr26xmdrps34yq.png)

- Read the INSTRUCTIONS carefully, to start playing the game.


![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/6o18xdziczrwiy7nckmz.png)

- You can choose to enter your own input, or click to copy the AI generated one, and paste it.


![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/9qnkb8kupslxgvxbx54l.png)

- Now you will be redirected to the main Rules and Engagements page, which you have to look carefully and understand the game, about how to play it.


![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/tqe29uxsep1r2w8iv1jm.png)

- Upon closing the previous dialog, you will be presented with the actual AI created story context, with help of your input as below.


![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ctz8mcd0eeu9pa2zd5wk.png)

- Additionally, for portable view and summarized view, you would also be receiving the case details in your inbox , that has a well formatted structure, like :


![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/4u5gwzaaz7l8qdosbqv0.PNG)

- You can start investigating about the people you met, referring the sample suggestions, in the investigation input


![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/mkgp72hob0izt1o53rx2.png)

- This is how you would receive the response, of your investigation. A well written response, along with a safe image generated, that matches with the response.


![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/6bfiuaikj0plke59ozms.png)

- You would also receive each investigation of yours, in your email as well, as a snigle thread of emails per case.


![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/5bqis8bxo7tyvswtuba0.PNG)

- Similarly, you can perform any number of investigations as you please, and you would have a neatly arranged investigation panel, with all of them at your ease of access


![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/y9dzr34s4cyb75q05pyr.png)

- Your email inbox thread would look like this :


![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/37473m3emb6elazpl5ie.PNG)

- Feeling fun, or difficult to solve it yourselves ?
You can choose to invite your friends, using the button


![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/9pq86nqcjhaonopafijb.png)

All your investigations will be shared with your friend's email as well, and he can read your investigations from the email itself as well, or he can choose to login to the game with his invited email to investigate more by himself.

- The case gets solved / closed, if atleast one player per case submits an answer.


![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/z0vuu43jwx7i6cb3pkby.png)

Close the final dialog box, to exit the case and start a new one.


## Feature overview
 - User can start with just their SSO email address with well known third party hosted authentication.
 - User can input their own custom day's experience, or opt to choose an AI generated one.
 - Users receive awesome text images, in response to the investigations, and the story.
 - Each of the gerenated image is been uploaded to pinata, and pinata powers and drives the file uploads and retrieval for the application.
 - Users can choose to view their friends, to invite to the game.
 - Invited friends, and Uninivited friends are segregated in the UI
 - Investigations performed, upto the point of inviting will be shared the invited friend.
 - The UI shows only the investigation made by the current logged in user.
 - The email thread of a particular case shows the investigations made by all the people who are invited to that case.
 - You can revisit the rules, story context, or the day input whenever you please.
 

## More details

###PINATA

Pinata is used to store , upload and retrieve the AI generated images that are being sent via the email, as well as to the frontend for simulation.

###AI products
- gemini-1.5-flash , for story and investigation text generation.
- @cf/stabilityai/stable-diffusion-xl-base-1.0, for image generation.

Third party products have been used for efficient email communication, and contacts retrieval.

<!-- Team Submissions: Please pick one member to publish the submission and credit teammates by listing their DEV usernames directly in the body of the post. -->

<!-- Don't forget to add a cover image (if you want). -->

<!-- Thanks for participating! -->