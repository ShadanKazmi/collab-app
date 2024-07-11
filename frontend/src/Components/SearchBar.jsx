import React, { useState } from 'react';
import { Search } from 'semantic-ui-react';
import axios from 'axios';

const SearchBar = ({ onUserSelect }) => {
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [value, setValue] = useState('');

    const handleSearchChange = async (e, data) => {
        setLoading(true);
        setValue(data.value);

        try {
            const response = await axios.get(`https://collab-app-backend.onrender.com/userAuth/search?query=${data.value}`);
            const formattedResults = response.data.map(user => ({
                title: `${user.firstName} ${user.lastName}`,
                description: user.email,
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                gender: user.gender,
                profileImageURL: user.profileImageURL
            }));
            setResults(formattedResults);
        } catch (error) {
            console.error('Error searching:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleResultSelect = (e, data) => {
        const selectedUser = results.find(result => result.title === data.result.title);
        onUserSelect(selectedUser);
        setValue('');
        setResults([]);
    };

    return (
        <div>
            <Search
                loading={loading}
                onSearchChange={handleSearchChange}
                onResultSelect={handleResultSelect}
                results={results}
                value={value}
                placeholder="Search..."
                className="mr-4"
                size='big'
            />
        </div>
    );
};

export default SearchBar;
