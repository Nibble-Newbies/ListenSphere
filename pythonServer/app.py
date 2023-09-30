from flask import Flask, jsonify, request
import numpy as np

app = Flask(__name__)

# @app.route('/calculate/jaccard', methods=['POST'])
# def calculate_jaccard_similarity():
#     try:
#         user_song_matrix = request.json['user_song_matrix']
        
#         # Perform Jaccard similarity calculations on the provided matrix
#         num_users = len(user_song_matrix)
#         user_similarity = np.zeros((num_users, num_users))

#         for i in range(num_users):
#             for j in range(num_users):
#                 if i != j:
#                     set1 = set(user_song_matrix[i])
#                     set2 = set(user_song_matrix[j])
#                     intersection = len(set1.intersection(set2))
#                     union = len(set1.union(set2))
#                     similarity = intersection / union if union != 0 else 0.0
#                     user_similarity[i][j] = similarity

#         return jsonify({'user_similarity': user_similarity.tolist()})
#     except Exception as e:
#         return jsonify({'error': str(e)}), 400

@app.route('/calculate/jaccard', methods=['POST'])
def calculate_jaccard_similarity():
    try:
        user_song_data = request.json  # assuming the input is in the format you provided

        # Extract unique user and song IDs
        all_user_ids = set()
        all_song_ids = set()
        for entry in user_song_data:
            all_user_ids.add(entry['userID'])
            all_song_ids.update(entry['songs'])

        # Create a mapping from user IDs and song IDs to matrix indices
        user_id_to_index = {user_id: i for i, user_id in enumerate(sorted(all_user_ids))}
        song_id_to_index = {song_id: i for i, song_id in enumerate(sorted(all_song_ids))}

        # Create an empty user-song matrix
        num_users = len(all_user_ids)
        num_songs = len(all_song_ids)
        user_song_matrix = np.zeros((num_users, num_songs))

        # Populate the user-song matrix based on the provided data
        for entry in user_song_data:
            user_index = user_id_to_index[entry['userID']]
            for song_id in entry['songs']:
                song_index = song_id_to_index[song_id]
                user_song_matrix[user_index][song_index] = 1

        # Perform Jaccard similarity calculations on the provided matrix
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

        # Find the most similar users to each user
        closest_users = {}
        for i, user_id in enumerate(sorted(all_user_ids)):
            similar_users = sorted(range(num_users), key=lambda j: user_similarity[i][j], reverse=True)
            closest_users[user_id] = [sorted(all_user_ids)[j] for j in similar_users[1:]]  # Exclude the user itself

        return jsonify({'user_similarity': user_similarity.tolist(), 'closest_users': closest_users})
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



