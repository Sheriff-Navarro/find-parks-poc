# Original ask
# session: 1d356804-ce72-477d-91cd-a24324e4c4d6
# pinned: 2026-10-27T11:32:26Z
# Do not rewrite. Only the human can change this.
<!-- original-ask -->
Task
- Help break down this project into small scopable pieces of work, that I can pass to different agents. 

Constraints
- I don't want to lose context. I would like each prompt to point back to a simple rule that has the context of the work being done use the attached .pdf as reference for what the rule should include. In addition, I need each agent to update a progress.md file so it knows where in the lilfecycle of the project it is. 

The application will be a 
- Vite
- React
- Typescript
- Tailwind (for design system)
-- Design Sytem needs to account for breakpoints of mobile and desktop

Data 
- Because of time constraints we will use the sampe.json for the data
- we will not use an api that requires an authentication key etc.
- 

Map
- From preliminary research I will use the react-leaflet package for the map

Routing
- Each park will have a dedicated route `/park/:id`

Search
- One of the later or last features we will add is a search functionality
- Searching will filter the list of parks per the query used
- Map markers will also be filtered by the search query

Design
- Here are some attached screenshots of inspiration for both mobile and desktop

Output 
- Create a simple plan md file that can be followed along, with helpful prompts that can be passed to an agent. Advise on whether multiple prompts can be ran concurrently or what has to be run in sequence. Use Wave / Track / Sequence methodolgies, constraint would be editing same file.
