import { useState, useMemo } from 'react';

import AgentItem from '../components/agents/AgentItem';
import { Container, Snackbar, Grid } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';
import { INTERPRETERS } from '../hooks/store/constants';
import { useApi } from '../hooks/context/ApiContext';

import { solve } from '../utils/formula';
import useFetchInterval from '../hooks/useFetchInterval';

// import logger from '../utils/logger';
// const log = logger('DASHBOARD');

export default function Dashboard() {
  const classes = useStyles();
  const { interpret, client } = useApi();
  const [data, setData] = useState({});

  const companies = interpret({
    type: INTERPRETERS.GET_COMPANIES,
  });

  const views = useMemo(
    () =>
      interpret({
        type: INTERPRETERS.GET_SIGNALING_VIEWS,
      }),
    []
  );

  const solvingTagSpecialCase = {
    type: 'tag',
    func: (graph) => ({
      type: 'number',
      value: data[graph.id][0].value,
    }),
  };

  const agents = !companies.length
    ? []
    : interpret({
        type: INTERPRETERS.GET_AGENTS,
      })
        .map((agent) => ({
          ...agent,
          companyName: companies.find(
            (company) => company.publicId === agent.companyId
          ).name,
          signallingViews: views
            // Pick views that have active signals
            .filter(
              (view) =>
                view.agentId === agent.publicId && view.signal.type !== 'none'
            )
            // Convert them to a more convenient form
            .map(({ name, signal, formulaGraph }) => {
              // log({ data });
              const value = Object.keys(data).length
                ? solve(formulaGraph, solvingTagSpecialCase).value
                : 'none';

              const passed =
                signal.type === 'greater'
                  ? value > signal.threshold
                  : value < signal.threshold;

              return {
                name,
                signal,
                value,
                passed,
              };
            })
            // Passed signals at the top, only show 3
            .sort(({ passed }) => (passed ? -1 : 0))
            .slice(0, 3),
        }))
        // Sort agents by passed signals
        .sort((a1, a2) =>
          a1.signallingViews.find(({ passed }) => passed) ||
          !a2.signallingViews.length
            ? -1
            : 0
        );

  const { isError, intervalIsActive } = useFetchInterval(() => updateData);
  async function updateData() {
    const newDataByCompany = await Promise.all(
      companies.map(async (company) =>
        client.requestDashboardData(
          company.publicId,
          agents.reduce(
            (acc, agent) =>
              agent.companyId === company.publicId
                ? acc.concat(
                    agent.tags.filter((tag) =>
                      views.find((view) =>
                        view.tagIdsList.includes(tag.publicId)
                      )
                    )
                  )
                : acc,
            []
          )
        )
      )
    );

    let newData = newDataByCompany.reduce(
      (acc, companyData) => ({ ...acc, ...companyData }),
      {}
    );
    if (intervalIsActive) setData((data) => ({ ...data, ...newData }));
  }

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={isError}
        message='Some error occurred'
        autoHideDuration={8000}
        key='alert_message'
      />

      <Container className={classes.container}>
        <Grid container spacing={3}>
          {agents.map((agent) => (
            <Grid key={agent.publicId} item xs={12} sm={6} md={4}>
              <AgentItem agent={agent} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2),
  },
}));
