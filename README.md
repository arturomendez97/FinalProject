<h1>
    Flow
</h1>

<h2>
     Where artists from around the world display their works, recieve critique, and push others forward into their journey. 
</h2>

<h3>
    Server / Back-End specifications
</h3>

<h4>
	Endpoints
</h4>

<h4>
	User Endpoints
</h4>
<ul>
    <li>
        GET - '/api/users' -> Get all users / Needs: Nothing / Returns: All users
    </li>
    <li>
        GET - '/api/get-userby_id' -> Get a user by id / Needs: user id on query / Returns: User
    </li>
    <li>
        GET - '/api/get-user' -> Get a user by email / Needs: user email on body / Returns: User
    </li>
    <li>
        GET - '/api/validate-user' -> Validate user / Needs: sessiontoken on header / Returns: User
    </li>
</ul>

<h4>
	Artwork Endpoints
</h4>
<ul>
    <li>
        GET - '/api/artworks' -> Get all artworks / Needs: Nothing / Returns: All artworks
    </li>
    <li>
        POST - '/api/create-artwork' -> Create an artwork / Needs: image name, description, user_id, and sessiontoken on body, and image to upload  / Returns: Created artwork
    </li>
    <li>
        GET - '/api/get-artworksbyid' -> Get artworks by a user id / Needs: user id on query / Returns: Artworks
    </li>
    <li>
        GET - '/api/get-artworkbyid' -> Get an artwork by an artwork id / Needs: artwork id on query / Returns: Artwork
    </li>
    <li>
        DELETE - '/api/delete-artworkbyid' -> Delete an artwork by an artwork id / Needs: artwork id on query / Returns: Deleted Object
    </li>
</ul>

<h4>
	Comment Endpoints
</h4>
<ul>
    <li>
        GET - '/api/comments' -> Get all comments / Needs: Nothing / Returns: All comments
    </li>
    <li>
        GET - '/api/get-commentsbyArtwork' -> Get comments by an artwork id / Needs: Artwork id on query / Returns: Comments
    </li>
    <li>
        DELETE - '/api/delete-commentsbyArtwork' -> Delete all comments related to an artwork id / Needs: Artwork id on query / Returns: Deleted Object
    </li>
    <li>
        DELETE - '/api/delete-commentsbycontentAndUserId' -> Delete all comments related to a user id and the content inside the comment/ Needs: sessiontoken header and comment content on query / Returns: Deleted Object
    </li>
    <li>
        POST - '/api/create-comment' -> Create a comment / Needs: sessiontoken on header, comment content and artwork id (artwork it belongs to) on body / Returns: Created Comment
    </li>
</ul>

<h4>
	Login and Signup Endpoints
</h4>
<ul>
    <li>
        POST - '/api/users/login' -> User login / Needs: user email and password on the body / Returns: User session token
    </li>
    <li>
        POST - '/api/users/register' -> User Registration / Needs: user email, username, password and description on the body / Returns: Created user
    </li>
</ul>

<h4>
	Follow Endpoints
</h4>
<ul>
    <li>
        PATCH - '/api/users/updatefollow' -> update user follows / Needs: sessiontoken header and user id, user to add or delete from follows, and modify (if modify is 1 we add the user to follows, if it's -1 we delete the user from follows) / Returns: Updated user
    </li>
</ul>

<h4>
	Like Endpoints
</h4>
<ul>
    <li>
        PATCH - '/api/users/updatelike' -> update user likes / Needs: sessiontoken header and user id, artwork to add or delete from likes, and modify (if modify is 1 we add the artwork to likes, if it's -1 we delete the artwork from likes) / Returns: Updated user
    </li>
</ul>

<h4>
	Favorite Endpoints
</h4>
<ul>
    <li>
        PATCH - '/api/users/updatefavorite' -> update user favorites / Needs: sessiontoken header and user id, artwork to add or delete from favorites, and modify (if modify is 1 we add the artwork to favorites, if it's -1 we delete the artwork from favorites) / Returns: Updated user
    </li>
</ul>