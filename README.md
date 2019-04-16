# QuizSail

Test Prep Engine

### QuizSail contains a sample set of data comprising of a 240+ item set questions for WGU C857 Software QA.

The test prep engine uses a technique called *assumed competency*.  This technique assumes that if you answer the question correctly the first time that you already know the answer. Because of this, it's running on sort of an honor system, so if the user is not sure what the answer is they should not enter any answer at all instead of guessing.

A minor code change can remove the assumption and require the user to correctly answer the question up to the required number of times.

QuizSail's competency system works by holding a certain number of questions from the pool in-flight.  Once the user has correctly answered a question in the in-flight state so many times in a row, the question is moved to the completed state and is not asked again.  As long as the in-flight pool is full, the next question to appear is randomly selected from the questions in the pool that aged the most so that the same question is not likely to be asked twice in a row.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine.

You can run a live version here:
```
https://www.quizsail.com/?
```

### Prerequisites

* node


### Installing

* Clone this repo, run ```npm start```.

```
$ npm start
```

Then, open your browser and enter
```
http://localhost:3000/?
```

## Deployment Notes

```
 docker volume create quizsail
 docker build -t quizsail .
 docker run --mount 'type=volume,src=quizsail,dist=/usr/src/app/data' --restart=always -i -p 49000:3000 -d quizsail
```

## Contributing

Use pull requests.


## Authors

* **John Matzen** - *Initial work* - [jmatzen](https://github.com/jmatzen)
* LS - *Some CSS and HTML* - [SkillAllHumans](https://github.com/SkillAllHumans)


## License

This project is licensed under CC BY-NC-SA 4.0 - see  [https://creativecommons.org/licenses/by-nc-sa/4.0/](https://creativecommons.org/licenses/by-nc-sa/4.0/) file for details
