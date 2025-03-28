const Title = (stage : string, journeyType : string | null, productCategory : string) => {
    switch(stage) {
        case 'ssf-1':
            return "Great! let's get started";
        case 'ssf-2':
            return "Great! let's get started";
        case 'bd-3':
            if(journeyType === 'ETC' && (productCategory === 'CC' || productCategory === 'PL')) {
                return 'Please update or provide the required details';
            }
            else{
                return 'Tell us more about your employment details';
            }
        case 'bd-2':
            return 'Tell us more about yourself';
        case 'ad-1':
            return "Please provide your tax information details";
        case 'ad-2':
            return "Please update or provide the required details";
        case 'ACD' : 
            return "Please select your preferred credit card limit";
        case 'doc':
            return "Documents Upload";
        case 'bd-1':
            return "Great! let's get started"
        case 'rp': 
            return "Lastly, please read and submit your application"
        default:
            return 'Please update or provide the required details'
    }
}

export default Title;

