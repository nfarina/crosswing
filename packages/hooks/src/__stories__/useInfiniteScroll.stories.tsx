import React, { useState } from "react";
import { styled } from "styled-components";
import { useInfiniteScroll } from "../useInfiniteScroll.js";

export default {
  title: "hooks/useInfiniteScroll",
  parameters: { layout: "centered" },
};

export const Default = () => {
  // Build the big list of people.
  const [people] = useState(() => {
    const people: Person[] = [];

    for (let i = 0; i < 1000; i++) {
      people.push({ name: `Citizen #${i}` });
    }

    return people;
  });

  const [limit, onScroll] = useInfiniteScroll(people.length, [people], {
    pageSize: 50,
  });

  const visiblePeople = people.slice(0, limit);

  return (
    <Container onScroll={onScroll}>
      <div className="people">
        {visiblePeople.map((person, i) => (
          <div className="person" key={i}>
            {person.name}
          </div>
        ))}
      </div>
    </Container>
  );
};

interface Person {
  name: string;
}

const Container = styled.div`
  width: 400px;
  height: 400px;
  overflow: auto;
  display: flex;
  flex-flow: column;
  border: 1px solid gray;

  > .people {
    height: 0;
    flex-grow: 1;

    display: flex;
    flex-flow: column;

    > .person {
      flex-shrink: 0;
      height: 50px;
      font-family: sans-serif;
      display: flex;
      flex-flow: column;
      align-items: center;
      justify-content: center;

      @media (prefers-color-scheme: dark) {
        color: white;
      }
    }

    > .person + .person {
      border-top: 1px solid gray;
    }
  }
`;
