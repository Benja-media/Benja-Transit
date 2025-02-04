"use client";

import * as React from 'react';
import { useState, useEffect } from 'react';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid2';
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

export default function Page({ params }) {


    const [data, setData] = useState(null);
    //const [loading, setLoading] = useState(true);  

    const [direction, setDirection] = useState(0);

    const { agency, route_id } = React.use(params)
    useEffect(() => {
        fetch(`/api/data/${agency}/today_trips?route=${route_id}`)
            .then((res) => res.json())
            .then((data) => {
                setData(data);
                //setLoading(false);
            });
    }, []);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                    >
                        Transit Data Explorer
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box>
                <Grid container spacing={2} sx={{ p: 2 }}>
                    <Grid size={12}>
                        <Grid container spacing={2}>
                            <Grid size={12}>
                                <Paper sx={{ /*height: "100vh", */ width: '100%' }}>
                                {data?.results ? (
                                    <FormControl fullWidth>
                                        <InputLabel id="select-direction">Direction</InputLabel>
                                        <Select
                                            labelId="select-direction"
                                            id="select-direction"
                                            label="Direction"
                                            onChange={(e) => setDirection(e.target.value)}
                                            value={direction}
                                        >
                                            {data.results.length > 0 ? (
                                                data.results
                                                    .reduce((unique, item) => {
                                                        return unique.some(route => route.trip_headsign === item.trip_headsign && route.shape_id === item.shape_id)
                                                            ? unique
                                                            : [...unique, item];
                                                    }, []).map(route => (
                                                        <MenuItem
                                                            key={route.direction_id + "_" + route.trip_headsign}
                                                            value={route.direction_id + "_" + route.trip_headsign}>
                                                            {route.trip_headsign}
                                                        </MenuItem>
                                                    ))
                                            ) : null}
                                        </Select>

                                    </FormControl>) : (<Typography>Loading...</Typography>)}
                                    {data?.results ? (
                                    <DataGrid
                                        rows={(data && direction) ? data.results.filter((trip) => trip.direction_id === direction.split("_")[0] && trip.trip_headsign === direction.split("_")[1]) : []}
                                        columns={[
                                            { field: 'id', headerName: 'Trip ID', width: 200 },
                                            { field: 'trip_headsign', headerName: 'Trip Headsign', width: 200 },
                                            //{ field: 'direction_id', headerName: 'Direction ID', width: 200 },
                                            { field: 'block_id', headerName: 'Block ID', width: 200 },
                                            { field: 'first_stop_id', headerName: 'First Stop', width: 200 },
                                            { field: 'last_stop_id', headerName: 'Last Stop', width: 200 },
                                            { field: 'trip_start', headerName: 'Trip Start', width: 200 },
                                            { field: 'trip_end', headerName: 'Trip End', width: 200 },

                                        ]}
                                        initialState={{ pagination: { page: 0, pageSize: 5 } }}
                                        pageSizeOptions={[5, 10]}
                                        //checkboxSelection
                                        sx={{ border: 0 }}
                                        onRowClick={(row) => {
                                            window.location.href = `/data/${agency}/block/${row.row.block_id}`
                                        }
                                        }
                                    />) : null}
                                </Paper>

                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </Box >
    );
}
