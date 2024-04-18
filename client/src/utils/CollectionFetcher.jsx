class CollectionFetcher extends Component {
  async fetchData(collectionName, documentId) {
    try {
      const cachedData = localStorage.getItem(collectionName);
      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
          return data;
        }
      }

      const docRef = documentId ? doc(db, collectionName, documentId) : collection(db, collectionName);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log(`${collectionName} data exists in database:`);
        const fetchedData = documentId ? docSnap.data() : docSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        localStorage.setItem(collectionName, JSON.stringify({ data: fetchedData, timestamp: Date.now() }));
        return fetchedData;
      } else {
        console.log(`No such ${collectionName} data!`);
        return null;
      }
    } catch (error) {
      console.error(`Error fetching ${collectionName} data:`, error);
    }
  }

  async componentDidMount() {
    const { collectionName, documentId } = this.props;
    this.fetchData(collectionName, documentId);
  }

  render() {
    return null; // You can render components here if needed
  }
}


export default CollectionFetcher;