// quaternion algebra
// useState will be used to handle to slow search by returning a pair representing the current state and then a function to update the state respectively
import React, {useState} from 'react';
import './App.css';
import { AgChartsReact} from 'ag-charts-react';


const App = () => {
  //store data from search terms using useState where searchTerm is set to empty string. The setSearchTerm is updated with the input
  const [searchTerm, setSearchTerm] = useState("");
  //store data from API where books is set to an empty arry and setBooks method is used to update the value of books with the returned data
  const [books, setBooks] = useState([]);
  //how to handle slow search reaspone while waiting for data
  const [loading, setLoading]= useState(false);
  const [error, setError] = useState(null);
  const [clickList, setClickList] = useState([]);

  //format input to replace spaces with '+'
  const formatSearchTerm = searchTerm.split(' ').join('+');
  

  const onInputChange= (e) => {
    setSearchTerm(e.target.value);
  };

  let API_URL = `https://openlibrary.org/search.json?q=${formatSearchTerm}`;
  
  const fetchBooks = () => {
      setLoading(true);
      fetch(`${API_URL}`)
      .then((response) => response.json())
      // Books result
      .then((data) => setBooks(data.docs))
      .then(() => setLoading())
      .catch(setError);
  };

  if (loading) {
    return <h1 style={{textAlign: "center" }}>Searching Library...</h1>;
  }
  if (error) {
    return <pre>{JSON.stringify(error, null, 2)}</pre>;
  }
  if (!books) {
    return null;
  }

  
  // Submit handler
  const onSubmitHandler = (search) => {
    // Prevent browser refreshing after form submission
    search.preventDefault();
    // Call fetch books async function
    fetchBooks();
  };

  let year = [];
  function publishYear(obj){ 
    for (let i in obj){
      let publishYear = obj[i].publish_year;
      // console.log(publishYear);
      for(let p in publishYear){
        year.push(publishYear[p]);
      }
    }

  };

publishYear(books);


// let frequency= {}; 
// for(var i=0; i<year.length; ++i){
//   if(!frequency[year[i]])
//   frequency[year[i]] = 0;
//   ++frequency[year[i]];
// };

// console.log(year);

var sorted = year.slice().sort(function(a, b) {
  return a - b;
});

var smallest = sorted[0],                                 
    largest  = sorted[sorted.length - 1],
    yearSpan = largest-smallest;

function nodeClick (event) {
  let clickBook = [];
  var data = event.datum.data;
  for (var book in data){
    clickBook.push(data[book])
  } 
  setClickList(clickBook);
}
  const options = {
    autoSize: true,
    title: {
      enabled: true,
      text: `Results for "${searchTerm}"`,
      color: 'black', 
      fontWeight: 'bold',
      fontSize: 20,
    },
    data: books,
    series: [
      {
        type: 'histogram',
        xKey: 'first_publish_year',
        xName: 'Publicaiton Year',
        binCount: yearSpan,
        tooltip:{
          enabled: false,
        },
        label: {
          color: '#247',
          fontSize:9,
          fontWeight: 'bold',
  
        },
        fill: '#247', 
        stroke: '#fff',
        highlightStyle: {
          fill: 'rgba(0, 116, 255, 0.74)'
        },
        listeners: {
          nodeClick: nodeClick,
        },
      },
    ],
    legend: {
      enabled: false
    },
    navigator: {
      enabled: true,
    },
    axes: [
      {
        type: 'number',
        position: 'bottom',
        title: {
          enabled: true,
          text: 'Year of Publication'
        },
      },
      {
        type: 'number',
        position: 'left',
        title: {
          enabled: true,
          text: 'Number of Book Results'
        },
        tick: {
          width: 1,
          size: 6,
          count: 5
        },
      },
    ],
  };

  return (
    <div className="body">
      <h2 className="title">Search Open Library</h2>
      <form className="Search" onSubmit={onSubmitHandler}>
            <input
            className="input-field"
            type="search"
            placeholder="Enter Term to Search by"
            value={searchTerm}
            onChange={onInputChange}
            />
            <button className="button" type="submit">Find</button>
        </form>
      <AgChartsReact options={options} className='chart' />
      <div className = 'container'>
        <ul >
          {
            clickList.map((book, index) => {
              return (
                <li key={index}>
                  <div className = 'list'>
                    <img alt={`${book.title} book`} src={`http:////covers.openlibrary.org/b/olid/${book.cover_edition_key}-M.jpg`} />
                    <div className = 'list-item'>
                      
                      <h3>{book.title}</h3>
                      <p>{`Author: ${book.author_name}`}</p>
                      <p>{`Year first published: ${book.publish_year}`}</p>
                    </div>
                  </div>
                  <hr />
                </li>
              );
            })
          }
        </ul>
      </div>
    </div>
  );
};

export default App;
