import { createContext } from "react";
import PropTypes from 'prop-types'; // Import PropTypes
import { mentors } from "../assets/assets"; // Ensure this is the correct path

// Create a context for the app
export const AppContext = createContext();

const AppContextProvider = ({children}) => {
    // Define any necessary values to pass through context
    const currencySymbol = '$';

    // Value to be provided to the context consumers
    const value = {
        mentors,
        currencySymbol
    };

    // Wrap children with context provider
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

// PropTypes validation for children prop
AppContextProvider.propTypes = {
    children: PropTypes.node.isRequired // Validate that children are passed and it's a valid React node
};

export default AppContextProvider;
