# QuizSail

Test Prep Engine—Run a live version [here](https://www.quizsail.com/).

### QuizSail contains a 240+ bank of questions for WGU C857 Software QA.

The test prep engine uses a technique called *assumed competency*.  This technique assumes that if you answer the question correctly the first time that you already know the answer. Because of this, it's running on sort of an honor system, so if the user is not sure what the answer is they should not enter any answer at all instead of guessing.

A minor code change can remove the assumption and require the user to correctly answer the question up to the required number of times.

QuizSail's competency system works by holding a certain number of questions from the pool in-flight.  Once the user has correctly answered a question in the in-flight state so many times in a row, the question is moved to the completed state and is not asked again.  As long as the in-flight pool is full, the next question to appear is randomly selected from the questions in the pool that aged the most so that the same question is not likely to be asked twice in a row.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine.

### Prerequisites

* node


### Installing and Running

* Clone this repo.
* Run ```npm start```.
* Open your browser and enter ```http://localhost:3000/?```

## Deployment Notes

```
 docker build -t quizsail .
 docker run --mount 'type=volume,src=quizsail,dst=/usr/src/app/data' --restart=always -i -p 49000:3000 -d quizsail
```

## Contributing

Use pull requests.


## Authors

* **John Matzen** - *Initial work* - [jmatzen](https://github.com/jmatzen)
* L S - *Some CSS, HTML, JS* - [SkillAllHumans](https://github.com/SkillAllHumans)


## License

This project is licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).
