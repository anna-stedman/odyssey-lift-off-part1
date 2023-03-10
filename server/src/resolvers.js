const resolvers = {
    Query: {
        // returns an array of Tracks that will be used to populate the homepage grid of our web client
        tracksForHome: (_, __, {dataSources}) => {
            return dataSources.trackAPI.getTracksForHome();
        },
        // get a single track by ID, for the track page
        track: (_, {id}, {dataSources}) => {
            return dataSources.trackAPI.getTrack(id);
        },
    },

    Mutation: {
        //increments a track's numberOfViews property
        incrementTrackViews: async (_, {id}, {dataSources}) => {
            try {
                const track = await dataSources.trackAPI.incrementTrackViews(id);
            
                return {
                    code: 200,
                    success: true,
                    message: `Successfully incremented number of views for track ${id}`,
                    track,
                };
            } catch(err) {
                return {
                    code: err.extensions.response.status,
                    success: false,
                    message: err.extensions.response.body,
                    track: null
                };
            }
        }
    },

    Track: {
        // Parent argument contains data returned by the tracksForHome resolver.
        // tracksForHome returns a list, so Apollo Server iterates through the list and calls the Author resolver once for each track.
        // It passes the current track as the value of parents, so we can destructure this to extract authorId
        author: ({authorId}, _, {dataSources}) => {
            return dataSources.trackAPI.getAuthor(authorId);
        },
        modules: ({id}, _, {dataSources}) => {
            return dataSources.trackAPI.getTrackModules(id);
        },
    }
}

/* Resolver functions have a signature with four options parameters:
 (parent, args, context, info) => {}
 
 Parent is the returned value of the resolver for this field's parent

 args is an object that contains all GraphQL arguments that were provided for the field by the GraphQL operation.
    When querying for a specific item, with an id, the id argument will be accessible via the args parameter

 context is an object shared across all resolvers executing for a particular operation.
    This is used to share state like
        authentication information
        database connection
        RESTDataSource
 
 info contains information about the operation's execution state including
        field name
        path to the field from root
    It can be useful for more advance actions like setting cache policies at the resolver level
*/

module.exports = resolvers;