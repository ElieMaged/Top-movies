import clientPromise from "../lib/mongodb";
import { GetServerSideProps } from 'next';


interface Movie {
   _id: string;
   title: string;
   metacritic: number;
   plot: string;
   runtime:number;
}


interface MoviesProps {
   movies: Movie[];
}


const Movies: React.FC<MoviesProps> = ({ movies }) => {
   return (
       <div>
           <h1>Top 10 Movies of All Time</h1>
           <p>
               <small>(According to Metacritic)</small>
           </p>
           <ul className='text-white'>
               {movies.map((movie) => (
                   <li key={movie._id}>
                       <h2 className='underline	'>{movie.title}</h2>
                       <h3>{movie.metacritic} Score on Metacritic</h3>
                       <p>{movie.plot}</p>
                       <p>{movie.runtime} Minutes</p>
                       <br />
                   </li>
                  
               ))}
           </ul>
       </div>
   );
};


export default Movies;


export const getServerSideProps: GetServerSideProps = async () => {
   try {
       const client = await clientPromise;
       const db = client.db("sample_mflix");
       const movies = await db
           .collection("movies")
           .find({})
           .sort({ metacritic: -1 })
           .limit(5)
           .toArray();
       return {
           props: { movies: JSON.parse(JSON.stringify(movies)) },
       };
   } catch (e) {
       console.error(e);
       return { props: { movies: [] } };
   }
};