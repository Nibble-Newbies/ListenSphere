from flask import Flask, jsonify, request
import numpy as np

app = Flask(__name__)


@app.route('/calculate/jaccard', methods=['POST'])
def calculate_jaccard_similarity():
    try:
        user_song_matrix = request.json['user_song_matrix']
        
        # Perform Jaccard similarity calculations on the provided matrix
        num_users = len(user_song_matrix)
        user_similarity = np.zeros((num_users, num_users))

        for i in range(num_users):
            for j in range(num_users):
                if i != j:
                    set1 = set(user_song_matrix[i])
                    set2 = set(user_song_matrix[j])
                    intersection = len(set1.intersection(set2))
                    union = len(set1.union(set2))
                    similarity = intersection / union if union != 0 else 0.0
                    user_similarity[i][j] = similarity

        return jsonify({'user_similarity': user_similarity.tolist()})
    except Exception as e:
        return jsonify({'error': str(e)}), 400



@app.route('/closest_users/<int:user_id>', methods=['POST'])
def closest_users(user_id):
    try:
        # Get the user-song matrix from the request's JSON data
        user_song_matrix = request.json['user_song_matrix']

        if user_id < 1 or user_id > len(user_song_matrix):
            return jsonify({'error': 'Invalid user ID'}), 400

        # Perform Jaccard similarity calculations on the provided matrix
        num_users = len(user_song_matrix)
        user_similarity = np.zeros((num_users, num_users))
        for i in range(num_users):
            for j in range(num_users):
                if i != j:
                    set1 = set(user_song_matrix[i])
                    set2 = set(user_song_matrix[j])
                    intersection = len(set1.intersection(set2))
                    union = len(set1.union(set2))
                    similarity = intersection / union if union != 0 else 0.0
                    user_similarity[i][j] = similarity

        # Find the most similar users to the specified user
        similar_users = sorted(range(num_users), key=lambda i: user_similarity[user_id - 1][i], reverse=True)
        most_similar_users = similar_users[1:]  # Exclude the user itself

        return jsonify({'closest_users': most_similar_users})
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    

if __name__ == '__main__':
    app.run(debug=True)



